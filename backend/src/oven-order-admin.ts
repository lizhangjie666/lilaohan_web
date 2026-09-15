import {
  adminOrderDto,
  allocateOvenOrderSerial,
  DEFAULT_OVEN_MINUTES,
  encryptPhone,
  findOvenOrder,
  listOvenOrders,
  normalizeCustomerName,
  normalizePhone,
  OVEN_ORDER_STATUSES,
  OVEN_ORDER_UID,
  phoneDigest,
  phoneLast4,
  syncOverdueOvenOrders,
  uploadOvenImage,
  uploadedFile,
  validateOvenImage,
} from './oven-orders';

function reject(ctx: any, status: number, message: string) {
  ctx.status = status;
  ctx.body = { data: null, error: { status, message } };
}

async function removeMedia(strapi: any, media: any) {
  if (!media) return;
  try { await strapi.plugin('upload').service('upload').remove(media); } catch {}
}

export function registerOvenOrderAdmin(strapi: any) {
  const controller = {
    async list(ctx: any) {
      const orders = await listOvenOrders(strapi);
      ctx.body = { data: orders.map((order: any) => adminOrderDto(strapi, order)) };
    },

    async create(ctx: any) {
      const customerName = normalizeCustomerName(ctx.request.body?.customerName);
      const phone = normalizePhone(ctx.request.body?.phone);
      if (!customerName) return reject(ctx, 400, '请填写顾客姓名。');
      if (!phone) return reject(ctx, 400, '请填写有效的联系电话。');
      const last4 = phoneLast4(phone);
      const sameTail = await strapi.db.query(OVEN_ORDER_UID).findOne({
        where: { phoneLast4: last4, status: { $in: ['processing', 'ready'] } },
      });
      if (sameTail) return reject(ctx, 409, '该手机尾号已有进行中的面包，请先标记为已领取或已取消。');

      const beforeFile = uploadedFile(ctx, 'beforeImage');
      const imageError = await validateOvenImage(beforeFile);
      if (imageError) return reject(ctx, 400, imageError);

      let uploaded: any = null;
      try {
        uploaded = await uploadOvenImage(strapi, beforeFile, `${customerName}入炉前照片`);
        const serialNumber = await allocateOvenOrderSerial(strapi);
        const startedAt = new Date();
        const estimatedReadyAt = new Date(startedAt.getTime() + DEFAULT_OVEN_MINUTES * 60 * 1000);
        const order = await strapi.db.query(OVEN_ORDER_UID).create({
          data: {
            serialNumber,
            customerName,
            phoneEncrypted: encryptPhone(strapi, phone),
            phoneHash: phoneDigest(strapi, phone),
            phoneLast4: last4,
            startedAt,
            estimatedReadyAt,
            status: 'processing',
            beforeImage: uploaded?.id,
          },
          populate: { beforeImage: true, afterImage: true },
        });
        ctx.status = 201;
        ctx.body = { data: adminOrderDto(strapi, order) };
      } catch (error) {
        await removeMedia(strapi, uploaded);
        strapi.log.error(`创建出炉进度失败：${String(error)}`);
        return reject(ctx, 500, '暂时无法创建进度记录，请重试。');
      }
    },

    async update(ctx: any) {
      const order = await findOvenOrder(strapi, String(ctx.params.documentId || ''));
      if (!order) return reject(ctx, 404, '没有找到这条进度记录。');
      const data: Record<string, any> = {};

      if (ctx.request.body?.adjustMinutes !== undefined) {
        const minutes = Number(ctx.request.body.adjustMinutes);
        if (!Number.isInteger(minutes) || minutes < -180 || minutes > 360) {
          return reject(ctx, 400, '调整时间必须是 -180 到 360 之间的整数分钟。');
        }
        if (['collected', 'cancelled'].includes(order.status)) return reject(ctx, 400, '已领取或已取消的记录不能调整时间。');
        const estimated = new Date(new Date(order.estimatedReadyAt).getTime() + minutes * 60 * 1000);
        data.estimatedReadyAt = estimated;
        data.status = estimated.getTime() <= Date.now() ? 'ready' : 'processing';
      }

      if (ctx.request.body?.status !== undefined) {
        const status = String(ctx.request.body.status);
        if (!OVEN_ORDER_STATUSES.includes(status as any)) return reject(ctx, 400, '进度状态不正确。');
        data.status = status;
        data.collectedAt = status === 'collected' ? new Date() : null;
      }

      const customerName = ctx.request.body?.customerName === undefined
        ? undefined
        : normalizeCustomerName(ctx.request.body.customerName);
      if (customerName !== undefined) {
        if (!customerName) return reject(ctx, 400, '顾客姓名不能为空。');
        data.customerName = customerName;
      }
      if (ctx.request.body?.phone !== undefined) {
        const phone = normalizePhone(ctx.request.body.phone);
        if (!phone) return reject(ctx, 400, '请填写有效的联系电话。');
        data.phoneEncrypted = encryptPhone(strapi, phone);
        data.phoneHash = phoneDigest(strapi, phone);
        data.phoneLast4 = phoneLast4(phone);
        data.phonePurgedAt = null;
      }
      if (!Object.keys(data).length) return reject(ctx, 400, '没有需要保存的修改。');

      const updated = await strapi.db.query(OVEN_ORDER_UID).update({
        where: { id: order.id },
        data,
        populate: { beforeImage: true, afterImage: true },
      });
      ctx.body = { data: adminOrderDto(strapi, updated) };
    },

    async images(ctx: any) {
      const order = await findOvenOrder(strapi, String(ctx.params.documentId || ''));
      if (!order) return reject(ctx, 404, '没有找到这条进度记录。');
      const beforeFile = uploadedFile(ctx, 'beforeImage');
      const afterFile = uploadedFile(ctx, 'afterImage');
      if (!beforeFile && !afterFile) return reject(ctx, 400, '请选择需要上传的照片。');
      const beforeError = await validateOvenImage(beforeFile);
      const afterError = await validateOvenImage(afterFile);
      if (beforeError || afterError) return reject(ctx, 400, beforeError || afterError || '照片无效。');

      const uploadedBefore = await uploadOvenImage(strapi, beforeFile, `${order.customerName}入炉前照片`);
      const uploadedAfter = await uploadOvenImage(strapi, afterFile, `${order.customerName}出炉后照片`);
      try {
        const updated = await strapi.db.query(OVEN_ORDER_UID).update({
          where: { id: order.id },
          data: {
            beforeImage: uploadedBefore?.id || order.beforeImage?.id,
            afterImage: uploadedAfter?.id || order.afterImage?.id,
          },
          populate: { beforeImage: true, afterImage: true },
        });
        if (uploadedBefore && order.beforeImage) await removeMedia(strapi, order.beforeImage);
        if (uploadedAfter && order.afterImage) await removeMedia(strapi, order.afterImage);
        ctx.body = { data: adminOrderDto(strapi, updated) };
      } catch (error) {
        await removeMedia(strapi, uploadedBefore);
        await removeMedia(strapi, uploadedAfter);
        throw error;
      }
    },

    async sync(ctx: any) {
      await syncOverdueOvenOrders(strapi);
      const orders = await listOvenOrders(strapi);
      ctx.body = { data: orders.map((order: any) => adminOrderDto(strapi, order)) };
    },
  };

  strapi.get('controllers').set('admin::oven-orders', controller);
  strapi.admin.routes['oven-orders'] = {
    type: 'admin',
    prefix: '/admin',
    routes: [
      { method: 'GET', path: '/oven-orders', handler: 'oven-orders.list', config: { policies: ['admin::isAuthenticatedAdmin'] } },
      { method: 'POST', path: '/oven-orders', handler: 'oven-orders.create', config: { policies: ['admin::isAuthenticatedAdmin'] } },
      { method: 'PUT', path: '/oven-orders/:documentId', handler: 'oven-orders.update', config: { policies: ['admin::isAuthenticatedAdmin'] } },
      { method: 'POST', path: '/oven-orders/:documentId/images', handler: 'oven-orders.images', config: { policies: ['admin::isAuthenticatedAdmin'] } },
      { method: 'POST', path: '/oven-orders/sync', handler: 'oven-orders.sync', config: { policies: ['admin::isAuthenticatedAdmin'] } },
    ],
  };
}
