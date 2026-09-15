import { formatOvenBatchNumber } from '../../../oven-rules';

const BATCH_UID = 'api::oven-batch.oven-batch';
const CREATION_UID = 'api::bread-creation.bread-creation';

function query(strapi: any, uid: string) {
  return strapi.db.query(uid);
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
    batch: relatedBatch ? {
      batchNumber: formatOvenBatchNumber(relatedBatch.batchNumber),
      batchDate: relatedBatch.batchDate,
      status: relatedBatch.status,
    } : null,
  };
}

function batchDto(batch: any, creations: any[] = []) {
  return {
    documentId: batch.documentId,
    batchNumber: formatOvenBatchNumber(batch.batchNumber),
    batchDate: batch.batchDate,
    status: batch.status,
    creations: creations.map(creation => creationDto(creation, batch)),
  };
}

async function creationsFor(strapi: any, batchId: number) {
  return query(strapi, CREATION_UID).findMany({
    where: { batch: { id: batchId }, visible: true },
    populate: { beforeImage: true, afterImage: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default {
  async today(ctx: any) {
    ctx.body = { data: null };
  },

  async batch(ctx: any) {
    const batchNumber = Number(ctx.params.batchNumber);
    if (!Number.isInteger(batchNumber) || batchNumber <= 0) return reject(ctx, 400, '炉号格式不正确。');
    const batch = await query(strapi, BATCH_UID).findOne({ where: { batchNumber } });
    if (!batch) return reject(ctx, 404, '没有找到这一炉。');
    ctx.body = { data: batchDto(batch, await creationsFor(strapi, batch.id)) };
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
    return reject(ctx, 410, '今日同炉已升级为店员登记，请使用序号查询面包进度。');
  },

  async fire(ctx: any) {
    return reject(ctx, 410, '添柴互动已经结束，请使用序号查询面包进度。');
  },

  async afterImage(ctx: any) {
    return reject(ctx, 410, '出炉照片现在由店员在后台统一上传。');
  },

  async event(ctx: any) {
    ctx.status = 204;
  },
};
