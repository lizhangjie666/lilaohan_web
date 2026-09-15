import crypto from 'crypto';
import fs from 'fs/promises';

export const OVEN_ORDER_UID = 'api::oven-order.oven-order';
export const OVEN_COUNTER_UID = 'api::oven-order-counter.oven-order-counter';
export const DEFAULT_OVEN_MINUTES = 90;
export const OVEN_ORDER_STATUSES = ['processing', 'ready', 'collected', 'cancelled'] as const;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function query(strapi: any, uid: string) {
  return strapi.db.query(uid);
}

function configuredSecret(strapi: any): string {
  const value = String(process.env.OVEN_PHONE_ENCRYPTION_KEY || '');
  if (value.length >= 32) return value;
  const appKeys = strapi.config.get('server.app.keys') as string[] | undefined;
  return appKeys?.[0] || 'local-development-only-oven-phone-key';
}

export function assertOvenPhoneEncryptionConfigured() {
  if (process.env.NODE_ENV === 'production' && String(process.env.OVEN_PHONE_ENCRYPTION_KEY || '').length < 32) {
    throw new Error('生产环境必须配置至少 32 位的 OVEN_PHONE_ENCRYPTION_KEY。');
  }
}

function encryptionKey(strapi: any): Buffer {
  return crypto.createHash('sha256').update(configuredSecret(strapi)).digest();
}

export function normalizeCustomerName(value: unknown): string {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 30);
}

export function normalizePhone(value: unknown): string {
  const raw = String(value || '').trim();
  const prefix = raw.startsWith('+') ? '+' : '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 20) return '';
  return `${prefix}${digits}`;
}

export function phoneLast4(phone: string): string {
  return phone.replace(/\D/g, '').slice(-4);
}

export function phoneDigest(strapi: any, phone: string): string {
  return crypto.createHmac('sha256', encryptionKey(strapi)).update(phone).digest('hex');
}

export function encryptPhone(strapi: any, phone: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(strapi), iv);
  const encrypted = Buffer.concat([cipher.update(phone, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString('base64url')}:${tag.toString('base64url')}:${encrypted.toString('base64url')}`;
}

export function decryptPhone(strapi: any, payload: unknown): string {
  try {
    const [version, iv, tag, encrypted] = String(payload || '').split(':');
    if (version !== 'v1' || !iv || !tag || !encrypted) return '';
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(strapi), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

export function maskPhone(phone: string, last4 = ''): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 7) return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  return last4 ? `****${last4}` : '号码已清除';
}

export function effectiveOrderStatus(order: any, now = Date.now()) {
  if (order.status === 'processing' && new Date(order.estimatedReadyAt).getTime() <= now) return 'ready';
  return order.status;
}

export function mediaDto(media: any) {
  if (!media) return null;
  return {
    url: media.url,
    alternativeText: media.alternativeText || '',
    caption: media.caption || '',
    width: media.width,
    height: media.height,
    formats: media.formats || {},
  };
}

export function publicOrderDto(order: any, now = Date.now()) {
  return {
    customerName: order.customerName,
    startedAt: order.startedAt,
    estimatedReadyAt: order.estimatedReadyAt,
    status: effectiveOrderStatus(order, now),
    collectedAt: order.collectedAt || null,
    beforeImage: mediaDto(order.beforeImage),
    afterImage: mediaDto(order.afterImage),
    serverTime: new Date(now).toISOString(),
  };
}

export function adminOrderDto(strapi: any, order: any, now = Date.now()) {
  const phone = decryptPhone(strapi, order.phoneEncrypted);
  return {
    documentId: order.documentId,
    ...publicOrderDto(order, now),
    phone: phone || null,
    phoneMasked: maskPhone(phone, order.phoneLast4),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function ensureOvenOrderCounter(strapi: any) {
  const existing = await query(strapi, OVEN_COUNTER_UID).findOne({ where: { name: 'global' } });
  if (existing) return existing;
  const latest = await query(strapi, OVEN_ORDER_UID).findOne({ orderBy: { serialNumber: 'desc' } });
  return query(strapi, OVEN_COUNTER_UID).create({
    data: { name: 'global', value: Number(latest?.serialNumber) || 0 },
  });
}

export async function allocateOvenOrderSerial(strapi: any): Promise<number> {
  await ensureOvenOrderCounter(strapi);
  let next = 0;
  await strapi.db.transaction(async ({ trx }: any) => {
    const table = strapi.db.getConnection('oven_order_counters').transacting(trx);
    const current = await table.where({ name: 'global' }).forUpdate().first();
    if (!current) throw new Error('出炉序号计数器未初始化。');
    next = Number(current.value) + 1;
    await table.where({ id: current.id }).update({ value: next, updated_at: new Date() });
  });
  return next;
}

export async function syncOverdueOvenOrders(strapi: any, now = new Date()) {
  const orders = await query(strapi, OVEN_ORDER_UID).findMany({
    where: { status: 'processing', estimatedReadyAt: { $lte: now } },
  });
  for (const order of orders) {
    await query(strapi, OVEN_ORDER_UID).update({ where: { id: order.id }, data: { status: 'ready' } });
  }
  return orders.length;
}

export async function purgeExpiredOvenPhones(strapi: any, now = new Date()) {
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const terminalOrders = await query(strapi, OVEN_ORDER_UID).findMany({
    where: {
      status: { $in: ['ready', 'collected', 'cancelled'] },
      phonePurgedAt: { $null: true },
    },
    limit: 1000,
  });
  const orders = terminalOrders.filter((order: any) => {
    const completedAt = order.status === 'collected'
      ? order.collectedAt
      : order.updatedAt;
    return completedAt && new Date(completedAt).getTime() <= cutoff.getTime();
  });
  for (const order of orders) {
    await query(strapi, OVEN_ORDER_UID).update({
      where: { id: order.id },
      data: { phoneEncrypted: null, phonePurgedAt: now },
    });
  }
  return orders.length;
}

export function uploadedFile(ctx: any, name: string) {
  const candidate = ctx.request.files?.[name];
  return Array.isArray(candidate) ? candidate[0] : candidate || null;
}

export async function validateOvenImage(file: any): Promise<string | null> {
  if (!file) return null;
  if (!file.filepath || !Number.isFinite(Number(file.size)) || Number(file.size) <= 0) return '请选择有效的照片。';
  if (Number(file.size) > MAX_IMAGE_BYTES) return '单张照片不能超过 5MB。';
  const type = String(file.mimetype || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(type)) return '仅支持 JPG、PNG 或 WebP 图片。';
  const header = await fs.readFile(file.filepath).then(buffer => buffer.subarray(0, 16));
  const jpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const png = header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = header.subarray(0, 4).toString() === 'RIFF' && header.subarray(8, 12).toString() === 'WEBP';
  return jpeg || png || webp ? null : '照片内容与文件格式不一致。';
}

export async function uploadOvenImage(strapi: any, file: any, title: string) {
  if (!file) return null;
  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name: `${title}-${Date.now()}`, alternativeText: title, caption: '顾客面包进度照片' } },
    files: file,
  });
  return uploaded;
}

export async function findOvenOrder(strapi: any, documentId: string) {
  return query(strapi, OVEN_ORDER_UID).findOne({
    where: { documentId },
    populate: { beforeImage: true, afterImage: true },
  });
}

export async function listOvenOrders(strapi: any) {
  await syncOverdueOvenOrders(strapi);
  return query(strapi, OVEN_ORDER_UID).findMany({
    populate: { beforeImage: true, afterImage: true },
    orderBy: { createdAt: 'desc' },
    limit: 200,
  });
}
