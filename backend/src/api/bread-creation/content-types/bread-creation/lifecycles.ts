const UID = 'api::bread-creation.bread-creation';

export default {
  async beforeDelete(event: any) {
    const creation = await (strapi.db.query as any)(UID).findOne({
      where: event.params.where,
      populate: { beforeImage: true, afterImage: true, reactions: true, events: true },
    });
    event.state = {
      ...(event.state || {}),
      guestImages: [creation?.beforeImage, creation?.afterImage].filter(Boolean),
      reactionIds: (creation?.reactions || []).map((item: any) => item.id),
      eventIds: (creation?.events || []).map((item: any) => item.id),
    };
  },

  async afterDelete(event: any) {
    const reactionQuery = (strapi.db.query as any)('api::fire-reaction.fire-reaction');
    const eventQuery = (strapi.db.query as any)('api::oven-event.oven-event');
    const reactionIds = event.state?.reactionIds || [];
    const eventIds = event.state?.eventIds || [];
    if (reactionIds.length) await reactionQuery.deleteMany({ where: { id: { $in: reactionIds } } });
    if (eventIds.length) await eventQuery.deleteMany({ where: { id: { $in: eventIds } } });
    for (const image of event.state?.guestImages || []) {
      try {
        await strapi.plugin('upload').service('upload').remove(image);
      } catch (error) {
        strapi.log.warn(`删除同炉作品图片失败：${String(error)}`);
      }
    }
  },
};
