import { errors } from '@strapi/utils';
import { ACTIVE_OVEN_STATUSES, formatOvenBatchNumber, nextOvenBatchNumber } from '../../../../oven-rules';

const UID = 'api::oven-batch.oven-batch';
const ACTIVE_STATUSES = [...ACTIVE_OVEN_STATUSES];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default {
  async beforeCreate(event: any) {
    const query = (strapi.db.query as any)(UID);
    const active = await query.findOne({ where: { status: { $in: ACTIVE_STATUSES } } });
    if (active) {
      throw new errors.ValidationError(
        `第 ${formatOvenBatchNumber(active.batchNumber)} 炉尚未结束，请先将它设为 finished（已结束）。`,
      );
    }

    const data = event.params.data;
    if (!data.batchNumber) {
      const latest = await query.findOne({ orderBy: { batchNumber: 'desc' } });
      if (!latest) {
        throw new errors.ValidationError('第一次创建炉次时请填写炉号，例如 086；之后可留空自动递增。');
      }
      data.batchNumber = nextOvenBatchNumber(latest.batchNumber, undefined);
    }
    data.batchDate ||= today();
  },

  async beforeUpdate(event: any) {
    const query = (strapi.db.query as any)(UID);
    const existing = await query.findOne({ where: event.params.where });
    if (!existing) return;

    if (
      event.params.data.batchNumber !== undefined &&
      Number(event.params.data.batchNumber) !== Number(existing.batchNumber)
    ) {
      throw new errors.ValidationError('炉号创建后不能修改，以免已有作品链接失效。');
    }

    const nextStatus = event.params.data.status ?? existing.status;
    if (ACTIVE_STATUSES.includes(nextStatus)) {
      const other = await query.findOne({
        where: { id: { $ne: existing.id }, status: { $in: ACTIVE_STATUSES } },
      });
      if (other) {
        throw new errors.ValidationError(
          `第 ${formatOvenBatchNumber(other.batchNumber)} 炉尚未结束，同一时间只能有一炉进行。`,
        );
      }
    }
  },
};
