import type { Core } from '@strapi/strapi';

const breadTutorial = {
  title: '窑烤面包 DIY 体验',
  slug: 'bread-diy',
  type: '面包 DIY',
  summary: '每人一份面团，自由做出3–6个喜欢的造型，等待窑火把创意烤成香喷喷的面包。',
  duration: '约110分钟',
  people: '亲子家庭、儿童、情侣、朋友和周末游客',
  materials: [
    { value: '面团由门店提前完成和面与第一次发酵' },
    { value: '基础配料与制作工具由门店准备' },
    { value: '成品提供包装，可自行带走' },
  ],
  ingredients: [
    { name: '肉松' },
    { name: '蔓越莓干' },
    { name: '葡萄干' },
    { name: '巧克力豆' },
  ],
  tools: [
    { name: '擀面杖' },
    { name: '切面刀' },
  ],
  steps: [
    { title: '领取面团', description: '领取门店提前和好并完成第一次发酵的面团。' },
    { title: '自由造型', description: '用约30分钟把面团做成喜欢的造型。' },
    { title: '添加配料', description: '加入当天准备的配料，完成口味和表面装饰。' },
    { title: '发酵', description: '让完成造型的面包继续发酵约40分钟。' },
    { title: '窑炉烤制', description: '由工作人员安全操作窑炉，烤制约20分钟。' },
    { title: '冷却', description: '面包出炉后冷却约20分钟，等待香气与口感稳定。' },
    { title: '打包带走', description: '装好自己的作品，把香喷喷的面包带回家。' },
  ],
  notes: [
    { value: '儿童体验需由监护人陪同。' },
    { value: '高温窑炉由工作人员操作，请勿自行靠近。' },
    { value: '如有食物过敏，请在预约时提前告知。' },
  ],
  consultationTip: '周末及节假日建议提前预约，具体时间以门店确认结果为准。',
  visible: true,
  sortOrder: 0,
};

export async function ensureDefaultDiyContent(strapi: Core.Strapi) {
  const tutorialDocuments = strapi.documents('api::diy-tutorial.diy-tutorial');
  let tutorial = await tutorialDocuments.findFirst({ filters: { slug: 'bread-diy' } } as any) as any;
  if (!tutorial) {
    tutorial = await tutorialDocuments.create({ data: breadTutorial as any, status: 'published' });
  }

  const settingDocuments = strapi.documents('api::diy-setting.diy-setting');
  const setting = await settingDocuments.findFirst({ populate: ['featuredTutorial'] } as any) as any;
  if (!setting) {
    await settingDocuments.create({
      data: {
        price: 78,
        priceUnit: '元 / 人',
        doughPerPerson: '每人一份面团',
        breadsPerPerson: '可创意造型3–6个面包',
        bookingGift: '提前预约赠送一份价值10元巧克力豆',
        featuredTutorial: tutorial.documentId,
        seo: {
          metaTitle: '李老汉窑烤面包DIY体验｜贵阳花溪镇山村',
          metaDescription: '贵阳市花溪区镇山村窑烤面包DIY体验，78元/人，每人一份面团，可创意造型3–6个面包，提供配料与工具，适合亲子家庭和周末出游。',
        },
      } as any,
      status: 'published',
    });
  } else if (!setting.featuredTutorial && tutorial) {
    await settingDocuments.update({
      documentId: setting.documentId,
      data: { featuredTutorial: tutorial.documentId } as any,
      status: 'published',
    });
  }

  const migrationStore = strapi.store({ type: 'plugin', name: 'lilaohan-content' });
  const version = Number(await migrationStore.get({ key: 'diy-promotion-migration-version' }) || 0);
  if (version < 1) {
    const sectionDocuments = strapi.documents('api::page-section.page-section');
    const hero = await sectionDocuments.findFirst({ filters: { sectionKey: 'diy.hero' } } as any) as any;
    const isOldDefault = hero
      && hero.title === '这一次，换你来做。'
      && hero.description === '从面团到出炉，每一步都能亲手参与。教程用于出发前了解流程，实际体验安排请提前联系门店确认。';

    if (isOldDefault) {
      await sectionDocuments.update({
        documentId: hero.documentId,
        data: {
          eyebrow: 'GUIYANG · ZHENSHAN VILLAGE',
          title: '窑烤面包 DIY 体验',
          description: '山有风，面包有香，生活很甜。\n在山水田园间，和面包来一场美好的相遇。',
          primaryButtonText: '立即预约',
          primaryButtonLink: '',
          secondaryButtonText: '看看怎么玩',
          secondaryButtonLink: '#diy-process',
        } as any,
        status: 'published',
      });
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 1 });
  }
}
