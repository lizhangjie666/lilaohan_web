import { findOvenOrder, OVEN_ORDER_UID, publicOrderDto, syncOverdueOvenOrders } from '../../../oven-orders';

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();
const GENERIC_LOOKUP_ERROR = '暂时无法查询，请核对手机号后四位或联系店员。';

function reject(ctx: any, status: number, message: string) {
  ctx.status = status;
  ctx.body = { data: null, error: { status, message } };
}

function ip(ctx: any) {
  return String(ctx.request.ip || ctx.ip || 'unknown');
}

function allowAttempt(ctx: any) {
  const now = Date.now();
  if (attempts.size > 1000) {
    for (const [key, value] of attempts) if (value.resetAt <= now) attempts.delete(key);
  }
  const key = ip(ctx);
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}

export default {
  async lookup(ctx: any) {
    if (!allowAttempt(ctx)) return reject(ctx, 429, '查询次数过多，请十分钟后再试。');

    const last4 = String(ctx.request.body?.phoneLast4 || '').replace(/\D/g, '').slice(-4);
    if (last4.length !== 4) {
      return reject(ctx, 404, GENERIC_LOOKUP_ERROR);
    }

    await syncOverdueOvenOrders(strapi);
    const matches = await strapi.db.query(OVEN_ORDER_UID).findMany({
      where: { phoneLast4: last4, status: { $in: ['processing', 'ready'] } },
      orderBy: { createdAt: 'desc' },
      limit: 2,
    });
    if (matches.length !== 1) {
      return reject(ctx, 404, GENERIC_LOOKUP_ERROR);
    }
    const order = await findOvenOrder(strapi, matches[0].documentId);
    if (!order) return reject(ctx, 404, GENERIC_LOOKUP_ERROR);
    ctx.body = { data: publicOrderDto(order) };
  },
};
