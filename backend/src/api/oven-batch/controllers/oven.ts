import crypto from 'crypto';
import fs from 'fs/promises';
import {
  ACTIVE_OVEN_STATUSES,
  canReactToOven,
  canSubmitToOven,
  canUploadAfterImage,
  cleanOvenText,
  formatOvenBatchNumber,
} from '../../../oven-rules';

const BATCH_UID = 'api::oven-batch.oven-batch';
const CREATION_UID = 'api::bread-creation.bread-creation';
const REACTION_UID = 'api::fire-reaction.fire-reaction';
const EVENT_UID = 'api::oven-event.oven-event';
const ACTIVE_STATUSES = [...ACTIVE_OVEN_STATUSES];
const PUBLIC_EVENT_TYPES = ['diy_view', 'oven_wall_view'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type LimitEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, LimitEntry>();

function query(strapi: any, uid: string) {
  return strapi.db.query(uid);
}

function firstValue(value: unknown): string {
  if (Array.isArray(value)) return firstValue(value[0]);
  return typeof value === 'string' ? value : '';
}

function cleanText(value: unknown, maxLength: number): string {
  return cleanOvenText(value, maxLength);
}

function formatBatchNumber(value: unknown): string {
  return formatOvenBatchNumber(value);
}

function secret(strapi: any, envName: string): string {
  const configured = process.env[envName];
  if (configured && configured.length >= 24) return configured;
  const appKeys = strapi.config.get('server.app.keys') as string[] | undefined;
  return appKeys?.[0] || process.env.APP_KEYS?.split(',')[0] || 'local-development-only-key';
}

function digest(strapi: any, envName: string, value: string): string {
  return crypto.createHmac('sha256', secret(strapi, envName)).update(value).digest('hex');
}

function clientIp(ctx: any): string {
  return String(ctx.request.ip || ctx.ip || 'unknown');
}

function withinRateLimit(ctx: any, bucket: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = `${bucket}:${clientIp(ctx)}`;
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

function reject(ctx: any, status: number, message: string) {
  ctx.status = status;
  ctx.body = { data: null, error: { status, message } };
}

function mediaDto(media: any) {
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

function creationDto(creation: any, batch?: any) {
  const relatedBatch = batch || creation.batch;
  return {
    documentId: creation.documentId,
    nickname: creation.nickname,
    breadName: creation.breadName,
    fireCount: Number(creation.fireCount) || 0,
    beforeImage: mediaDto(creation.beforeImage),
    afterImage: mediaDto(creation.afterImage),
    createdAt: creation.createdAt,
    batch: relatedBatch
      ? {
          batchNumber: formatBatchNumber(relatedBatch.batchNumber),
          batchDate: relatedBatch.batchDate,
          status: relatedBatch.status,
        }
      : null,
  };
}

function batchDto(batch: any, creations: any[] = []) {
  return {
    documentId: batch.documentId,
    batchNumber: formatBatchNumber(batch.batchNumber),
    batchDate: batch.batchDate,
    status: batch.status,
    creations: creations.map((creation) => creationDto(creation, batch)),
  };
}

function getUploadedFile(ctx: any, fieldName: string): any | null {
  const candidate = ctx.request.files?.[fieldName];
  return Array.isArray(candidate) ? candidate[0] : candidate || null;
}

async function validateImage(file: any): Promise<string | null> {
  if (!file?.filepath || !Number.isFinite(Number(file.size)) || Number(file.size) <= 0) {
    return '请选择一张有效的照片。';
  }
  if (Number(file.size) > MAX_IMAGE_BYTES) return '照片不能超过 5MB，请压缩后重试。';

  const declaredType = String(file.mimetype || '').toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(declaredType)) return '仅支持 JPG、PNG 或 WebP 图片。';

  const header = await fs.readFile(file.filepath).then((buffer) => buffer.subarray(0, 16));
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = header.subarray(0, 4).toString() === 'RIFF' && header.subarray(8, 12).toString() === 'WEBP';
  if (!isJpeg && !isPng && !isWebp) return '照片内容与文件格式不一致，请重新选择。';
  return null;
}

async function uploadImage(strapi: any, file: any, title: string) {
  const uploadService = strapi.plugin('upload').service('upload');
  const [uploaded] = await uploadService.upload({
    data: {
      fileInfo: {
        name: `${title}-${Date.now()}`,
        alternativeText: title,
        caption: '今日同炉顾客作品',
      },
    },
    files: file,
  });
  return uploaded;
}

async function removeUploadedFile(strapi: any, file: any) {
  if (!file) return;
  try {
    await strapi.plugin('upload').service('upload').remove(file);
  } catch (error) {
    strapi.log.warn(`清理同炉作品图片失败：${String(error)}`);
  }
}

async function findBatchCreations(strapi: any, batchId: number) {
  return query(strapi, CREATION_UID).findMany({
    where: { batch: { id: batchId }, visible: true },
    populate: { beforeImage: true, afterImage: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function recordEvent(strapi: any, eventType: string, anonymousId = '', batch?: any, creation?: any, eventKey?: string) {
  try {
    await query(strapi, EVENT_UID).create({
      data: {
        eventType,
        anonymousHash: anonymousId
          ? digest(strapi, 'OVEN_ANONYMOUS_ID_SALT', anonymousId)
          : undefined,
        eventKey,
        batch: batch?.id,
        creation: creation?.id,
      },
    });
  } catch (error) {
    // 浏览事件使用唯一键按天去重；重复事件无需影响顾客操作。
    strapi.log.debug(`同炉统计事件未重复写入：${String(error)}`);
  }
}

function validAnonymousId(value: string) {
  return /^[A-Za-z0-9_-]{16,128}$/.test(value);
}

export default {
  async today(ctx: any) {
    const batch = await query(strapi, BATCH_UID).findOne({
      where: { status: { $in: ACTIVE_STATUSES } },
      orderBy: { createdAt: 'desc' },
    });
    if (!batch) {
      ctx.body = { data: null };
      return;
    }
    const creations = await findBatchCreations(strapi, batch.id);
    ctx.body = { data: batchDto(batch, creations) };
  },

  async batch(ctx: any) {
    const batchNumber = Number(ctx.params.batchNumber);
    if (!Number.isInteger(batchNumber) || batchNumber <= 0) {
      return reject(ctx, 400, '炉号格式不正确。');
    }
    const batch = await query(strapi, BATCH_UID).findOne({ where: { batchNumber } });
    if (!batch) return reject(ctx, 404, '没有找到这一炉。');
    const creations = await findBatchCreations(strapi, batch.id);
    ctx.body = { data: batchDto(batch, creations) };
  },

  async creation(ctx: any) {
    const creation = await query(strapi, CREATION_UID).findOne({
      where: { documentId: ctx.params.documentId, visible: true },
      populate: { batch: true, beforeImage: true, afterImage: true },
    });
    if (!creation) return reject(ctx, 404, '没有找到这个面包档案。');
    ctx.body = { data: creationDto(creation) };
  },

  async create(ctx: any) {
    if (!withinRateLimit(ctx, 'create', 5, 10 * 60 * 1000)) {
      return reject(ctx, 429, '提交得太频繁了，请稍后再试。');
    }

    const body = ctx.request.body || {};
    const nickname = cleanText(body.nickname, 20);
    const breadName = cleanText(body.breadName, 30);
    const consent = firstValue(body.consent) === 'true';
    const file = getUploadedFile(ctx, 'beforeImage');
    if (!nickname) return reject(ctx, 400, '请填写面包师昵称。');
    if (!breadName) return reject(ctx, 400, '请给面包取一个名字。');
    if (!consent) return reject(ctx, 400, '提交前请确认作品墙展示说明。');
    const imageError = await validateImage(file);
    if (imageError) return reject(ctx, 400, imageError);

    const batch = await query(strapi, BATCH_UID).findOne({ where: { status: 'preparing' } });
    if (!batch || !canSubmitToOven(batch.status)) return reject(ctx, 409, '当前没有处于制作中的炉次，暂时不能提交作品。');

    let uploaded: any;
    try {
      uploaded = await uploadImage(strapi, file, `${breadName}入窑前`);
      const ownerToken = crypto.randomBytes(32).toString('base64url');
      const creation = await query(strapi, CREATION_UID).create({
        data: {
          batch: batch.id,
          nickname,
          breadName,
          beforeImage: uploaded.id,
          fireCount: 0,
          ownerTokenHash: digest(strapi, 'OVEN_OWNER_TOKEN_SECRET', ownerToken),
          visible: true,
        },
        populate: { batch: true, beforeImage: true, afterImage: true },
      });
      await recordEvent(strapi, 'creation_submitted', '', batch, creation);
      ctx.status = 201;
      ctx.body = { data: creationDto(creation), ownerToken };
    } catch (error) {
      await removeUploadedFile(strapi, uploaded);
      strapi.log.error(`同炉作品提交失败：${String(error)}`);
      return reject(ctx, 500, '作品暂时没有提交成功，请稍后重试。');
    }
  },

  async fire(ctx: any) {
    if (!withinRateLimit(ctx, 'fire', 60, 10 * 60 * 1000)) {
      return reject(ctx, 429, '添柴太频繁了，请稍后再试。');
    }
    const anonymousId = cleanText(ctx.request.body?.anonymousId, 128);
    if (!validAnonymousId(anonymousId)) return reject(ctx, 400, '匿名访客标识无效。');

    const creation = await query(strapi, CREATION_UID).findOne({
      where: { documentId: ctx.params.documentId, visible: true },
      populate: { batch: true },
    });
    if (!creation) return reject(ctx, 404, '没有找到这个面包档案。');
    if (!canReactToOven(creation.batch?.status)) {
      return reject(ctx, 409, '这一炉已经结束，暂时不能再添柴。');
    }

    const reactionKey = digest(
      strapi,
      'OVEN_ANONYMOUS_ID_SALT',
      `${creation.documentId}:${anonymousId}`,
    );
    let added = false;
    try {
      await strapi.db.transaction(async ({ trx }: any) => {
        const existing = await query(strapi, REACTION_UID).findOne({ where: { reactionKey } });
        if (existing) return;
        await query(strapi, REACTION_UID).create({
          data: { creation: creation.id, reactionKey },
        });
        await strapi.db
          .getConnection('bread_creations')
          .where({ id: creation.id })
          .transacting(trx)
          .increment('fire_count', 1);
        added = true;
      });
    } catch (error) {
      // 数据库唯一约束负责兜住并发双击，按“已经添过”返回。
      strapi.log.debug(`重复添柴被忽略：${String(error)}`);
    }

    const updated = await query(strapi, CREATION_UID).findOne({ where: { id: creation.id } });
    if (added) await recordEvent(strapi, 'fire_added', anonymousId, creation.batch, creation);
    ctx.body = {
      data: { fireCount: Number(updated?.fireCount) || 0, added, alreadyAdded: !added },
    };
  },

  async afterImage(ctx: any) {
    if (!withinRateLimit(ctx, 'after-image', 10, 10 * 60 * 1000)) {
      return reject(ctx, 429, '上传得太频繁了，请稍后再试。');
    }
    const ownerToken = cleanText(ctx.request.body?.ownerToken, 256);
    const file = getUploadedFile(ctx, 'afterImage');
    if (!ownerToken) return reject(ctx, 403, '这台设备没有该作品的上传凭证。');
    const imageError = await validateImage(file);
    if (imageError) return reject(ctx, 400, imageError);

    const creation = await query(strapi, CREATION_UID).findOne({
      where: { documentId: ctx.params.documentId, visible: true },
      populate: { batch: true, beforeImage: true, afterImage: true },
    });
    if (!creation) return reject(ctx, 404, '没有找到这个面包档案。');
    if (!canUploadAfterImage(creation.batch?.status)) {
      return reject(ctx, 409, '面包出炉后才能上传出炉照片。');
    }
    const suppliedHash = digest(strapi, 'OVEN_OWNER_TOKEN_SECRET', ownerToken);
    const expected = Buffer.from(String(creation.ownerTokenHash || ''), 'hex');
    const supplied = Buffer.from(suppliedHash, 'hex');
    if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
      return reject(ctx, 403, '作品上传凭证不正确，请使用最初提交作品的浏览器。');
    }

    let uploaded: any;
    const previous = creation.afterImage;
    try {
      uploaded = await uploadImage(strapi, file, `${creation.breadName}出炉后`);
      const updated = await query(strapi, CREATION_UID).update({
        where: { id: creation.id },
        data: { afterImage: uploaded.id },
        populate: { batch: true, beforeImage: true, afterImage: true },
      });
      if (previous?.id && previous.id !== uploaded.id) await removeUploadedFile(strapi, previous);
      await recordEvent(strapi, 'after_image_uploaded', '', creation.batch, creation);
      ctx.body = { data: creationDto(updated) };
    } catch (error) {
      await removeUploadedFile(strapi, uploaded);
      strapi.log.error(`出炉照片上传失败：${String(error)}`);
      return reject(ctx, 500, '出炉照片暂时没有保存成功，请稍后重试。');
    }
  },

  async event(ctx: any) {
    if (!withinRateLimit(ctx, 'event', 60, 60 * 1000)) {
      ctx.status = 204;
      return;
    }
    const eventType = cleanText(ctx.request.body?.eventType, 40);
    const anonymousId = cleanText(ctx.request.body?.anonymousId, 128);
    if (!PUBLIC_EVENT_TYPES.includes(eventType) || !validAnonymousId(anonymousId)) {
      return reject(ctx, 400, '统计事件格式不正确。');
    }
    const batchNumber = Number(ctx.request.body?.batchNumber);
    const batch = Number.isInteger(batchNumber) && batchNumber > 0
      ? await query(strapi, BATCH_UID).findOne({ where: { batchNumber } })
      : undefined;
    const anonymousHash = digest(strapi, 'OVEN_ANONYMOUS_ID_SALT', anonymousId);
    const eventKey = digest(
      strapi,
      'OVEN_ANONYMOUS_ID_SALT',
      `${eventType}:${anonymousHash}:${batch?.id || 'none'}:${new Date().toISOString().slice(0, 10)}`,
    );
    await recordEvent(strapi, eventType, anonymousId, batch, undefined, eventKey);
    ctx.status = 204;
  },
};
