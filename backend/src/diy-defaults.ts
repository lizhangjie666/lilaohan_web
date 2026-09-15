import type { Core } from '@strapi/strapi';

const breadTutorialChapters = [
  {
    anchor: 'oven', eyebrow: 'OVEN KNOWLEDGE', title: '窑炉科普篇',
    summary: '先认识热量如何被窑体储存和释放，再理解黑窑、白窑的结构差异。这里介绍通用知识，不代表门店窑炉的具体类型。',
    lessons: [
      { title: '蓄热式窑炉如何工作', description: '窑体先吸收燃烧产生的热量，再通过热辐射、传导和热空气把热量缓慢释放给食物。火熄灭后，厚重窑体仍能继续烘烤。', steps: [{ value: '生火加热窑体' }, { value: '让耐火材料充分蓄热' }, { value: '按窑炉结构整理燃烧区' }, { value: '利用稳定余热烘烤' }] },
      { title: '黑窑：火在烘烤室里燃烧', description: '黑窑的火焰和高温烟气会经过烘烤室。传统使用方式通常在窑体蓄热后移走燃料和灰烬，再利用余热烘烤；“黑”描述的是直接燃烧方式，不是外观颜色。' },
      { title: '白窑：火与烘烤室分开', description: '白窑的燃烧室与烘烤室分开，热量通过窑体或独立烟道传递，燃烧烟气不直接进入烘烤室；“白”同样不是外观颜色。' },
      { title: '黑窑与白窑有什么不同', description: '核心差别是火焰与烟气是否直接经过烘烤室。两种结构各有使用场景，不能只凭名称判断优劣，也不能据此推断门店使用的是哪一种。' },
      { title: '窑炉安全', description: '窑门、窑壁、烤盘和周边工具都可能保持高温。体验者应与操作区保持距离，入窑、转盘和出窑均由工作人员完成。', safetyNote: '儿童必须由成人陪同；不要触碰窑门、窑壁、余烬及刚出炉的烤盘。' },
    ],
  },
  {
    anchor: 'tools', eyebrow: 'TOOLS & SAFETY', title: '工具使用篇',
    summary: '认识擀面杖和切面刀，先学会安全、轻柔地使用工具，再开始塑造面团。',
    lessons: [
      { title: '擀面杖', description: '用于把面团擀开、控制厚薄和整理形状。不要一开始就用力压薄，以免排出过多气体或让厚薄失控。', steps: [{ value: '面团轻轻拍扁' }, { value: '从中间向外短距离擀压' }, { value: '转动面团检查厚薄' }, { value: '达到造型需要后停止' }], safetyNote: '操作时给手指留出空间，儿童应在成人指导下使用。' },
      { title: '切面刀 / 面团刮板', description: '用于分割面团、托起柔软面团和清理台面。它更适合向下利落分割，不要像锯子一样来回拉扯。', steps: [{ value: '握稳手柄' }, { value: '确认另一只手离开切线' }, { value: '刀口垂直向下一次分割' }, { value: '用宽面托起或移动面团' }], safetyNote: '放下时刀口朝下并远离桌边；儿童使用切面刀必须由成人全程指导。' },
    ],
  },
  {
    anchor: 'shaping', eyebrow: 'SHAPING CLASS', title: '面包造型篇',
    summary: '从基础圆餐包开始，再尝试小兔、花朵、麻花辫和花环。造型不必一模一样，连接牢固、大小均匀更重要。',
    lessons: [
      { title: '圆餐包', description: '最基础也最适合第一次练习的造型，重点是收紧表面并把收口藏到底部。', steps: [{ value: '面团轻轻拍平' }, { value: '边缘依次向中心折叠' }, { value: '捏紧收口并翻面' }, { value: '手掌呈杯状轻轻滚圆' }], safetyNote: '不要过度揉搓，避免面团表面撕裂。' },
      { title: '小兔', description: '用圆润主体和一对长耳朵表现小兔，五官可以用少量配料点缀。', steps: [{ value: '先整理出圆润主体' }, { value: '在顶部剪开或接上两只耳朵' }, { value: '轻轻拉长并压出耳窝' }, { value: '用少量配料装饰眼睛和鼻子' }], safetyNote: '耳朵与主体连接处要压紧，配料不要放得过密。' },
      { title: '花朵', description: '把圆面团均匀分成花瓣，适合在中心加入少量果干或肉松。', steps: [{ value: '面团滚圆并稍稍压扁' }, { value: '沿边缘均匀标出花瓣位置' }, { value: '切出花瓣但保留中心相连' }, { value: '轻转花瓣并装饰花心' }], safetyNote: '切割时保持间距，中心不要切断。' },
      { title: '麻花辫', description: '三股面条交替编织，粗细一致能让成品发酵和上色更均匀。', steps: [{ value: '把面团分成三等份' }, { value: '搓成长度和粗细接近的长条' }, { value: '顶部捏合后交替编织' }, { value: '尾端捏紧并收到底部' }], safetyNote: '编织不要拉得太紧，要给发酵膨胀留出空间。' },
      { title: '花环', description: '先做长条或麻花辫，再首尾相接成为圆环，适合加上少量果干装饰。', steps: [{ value: '搓出均匀长条或编好麻花辫' }, { value: '弯成圆环并确认大小' }, { value: '首尾重叠后捏紧接口' }, { value: '整理圆度并点缀配料' }], safetyNote: '接口要充分压紧，否则发酵和烘烤时容易分开。' },
    ],
  },
];

const breadTutorial = {
  title: '窑烤面包 DIY 体验',
  slug: 'bread-diy',
  type: '面包 DIY',
  experienceStatus: '开放体验',
  summary: '每人一份面团，自由做出3–6个喜欢的造型，等待窑火把创意烤成香喷喷的面包。',
  duration: '约110分钟',
  people: '亲子家庭、儿童、情侣、朋友和周末游客',
  detailPrice: 78,
  detailPriceUnit: '元 / 人',
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
  tutorialChapters: breadTutorialChapters,
  notes: [
    { value: '儿童体验需由监护人陪同。' },
    { value: '高温窑炉由工作人员操作，请勿自行靠近。' },
    { value: '如有食物过敏，请在预约时提前告知。' },
  ],
  consultationTip: '周末及节假日建议提前预约，具体时间以门店确认结果为准。',
  visible: true,
  sortOrder: 0,
};

const pizzaTutorial = {
  title: '窑烤披萨 DIY 体验',
  slug: 'pizza-diy',
  type: '披萨 DIY',
  experienceStatus: '开放体验',
  detailPrice: 98,
  detailPriceUnit: '元 / 人',
  summary: '擀开面团、挑选配料、亲手铺满，再看它在窑火里快速鼓起。',
  duration: '时长待确认',
  people: '亲子、朋友和团建活动，具体安排请添加门店微信咨询。',
  materials: [
    { value: '披萨面团' },
    { value: '当日配料' },
    { value: '基础制作工具' },
  ],
  steps: [
    { title: '擀开面团', description: '学习把面团整理成适合入窑的形状。' },
    { title: '铺上配料', description: '按照口味选择当天可用的配料。' },
    { title: '送入窑炉', description: '由工作人员完成高温窑炉操作。' },
    { title: '一起分享', description: '出炉后切开品尝，记录自己的成品。' },
  ],
  notes: [
    { value: '配料会随季节和库存调整。' },
    { value: '高温窑炉区域请听从工作人员指引。' },
  ],
  visible: true,
  sortOrder: 1,
};

const preparingTutorials = [
  {
    title: '饼干 DIY 体验',
    slug: 'cookie-diy',
    type: '饼干 DIY',
    experienceStatus: '内容筹备中',
    summary: '项目内容正在筹备中，具体开放时间与体验安排请添加门店微信咨询。',
    visible: true,
    sortOrder: 2,
  },
  {
    title: '蜡染 DIY 体验',
    slug: 'tie-dye',
    type: '蜡染 DIY',
    experienceStatus: '内容筹备中',
    summary: '项目内容正在筹备中，具体开放时间与体验安排请添加门店微信咨询。',
    visible: true,
    sortOrder: 3,
  },
];

export async function ensureDefaultDiyContent(strapi: Core.Strapi) {
  const tutorialDocuments = strapi.documents('api::diy-tutorial.diy-tutorial');
  let tutorial = await tutorialDocuments.findFirst({ filters: { slug: 'bread-diy' } } as any) as any;
  if (!tutorial) {
    tutorial = await tutorialDocuments.create({ data: breadTutorial as any, status: 'published' });
  }

  const settingDocuments = strapi.documents('api::diy-setting.diy-setting');
  const setting = await settingDocuments.findFirst({ populate: ['featuredTutorial', 'seo', 'seo.shareImage'] } as any) as any;
  if (!setting) {
    await settingDocuments.create({
      data: {
        doughPerPerson: '每人一份面团',
        breadsPerPerson: '可创意造型3–6个面包',
        bookingGift: '提前预约赠送一份巧克力豆',
        featuredTutorial: tutorial.documentId,
        seo: {
          metaTitle: '李老汉窑烤面包DIY体验｜贵阳花溪镇山村',
          metaDescription: '贵阳市花溪区镇山村窑烤面包DIY体验，每人一份面团，可创意造型3–6个面包，提供配料与工具，适合亲子家庭和周末出游。',
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
  }

  if (version < 2 && setting) {
    const legacyGift = ['提前预约赠送一份价值', '10', '元巧克力豆'].join('');
    const update: Record<string, any> = {};
    if (setting.bookingGift === legacyGift) update.bookingGift = '提前预约赠送一份巧克力豆';
    if (setting.seo?.metaDescription?.includes('每人一份面团') && setting.seo.metaDescription.includes('适合亲子家庭和周末出游')) {
      update.seo = {
        ...(setting.seo.id ? { id: setting.seo.id } : {}),
        metaTitle: setting.seo.metaTitle,
        metaDescription: '贵阳市花溪区镇山村窑烤面包DIY体验，每人一份面团，可创意造型3–6个面包，提供配料与工具，适合亲子家庭和周末出游。',
        ...(setting.seo.shareImage ? { shareImage: setting.seo.shareImage.id ?? setting.seo.shareImage } : {}),
      };
    }
    if (Object.keys(update).length) {
      await settingDocuments.update({ documentId: setting.documentId, data: update as any, status: 'published' });
    }
  }
  if (version < 2) await migrationStore.set({ key: 'diy-promotion-migration-version', value: 2 });

  if (version < 3) {
    for (const item of preparingTutorials) {
      const existing = await tutorialDocuments.findFirst({ filters: { slug: item.slug } } as any);
      if (!existing) await tutorialDocuments.create({ data: item as any, status: 'published' });
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 3 });
  }

  if (version < 4) {
    const existingTutorials = await tutorialDocuments.findMany({} as any) as any[];
    for (const item of existingTutorials) {
      if (!item.experienceStatus) {
        await tutorialDocuments.update({
          documentId: item.documentId,
          data: { experienceStatus: '开放体验' } as any,
          status: item.publishedAt ? 'published' : 'draft',
        });
      }
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 4 });
  }

  if (version < 5) {
    for (const slug of ['bread-diy', 'pizza-diy']) {
      const publishedTutorial = await tutorialDocuments.findFirst({ filters: { slug }, status: 'published' } as any) as any;
      if (publishedTutorial && !publishedTutorial.experienceStatus) {
        await tutorialDocuments.update({
          documentId: publishedTutorial.documentId,
          data: { experienceStatus: '开放体验' } as any,
          status: 'published',
        });
      }
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 5 });
  }

  if (version < 6) {
    const publishedBread = await tutorialDocuments.findFirst({
      filters: { slug: 'bread-diy' },
      status: 'published',
      populate: ['tutorialChapters', 'seo'],
    } as any) as any;
    if (publishedBread) {
      const update: Record<string, any> = {};
      if (publishedBread.detailPrice == null) update.detailPrice = 78;
      if (!publishedBread.detailPriceUnit) update.detailPriceUnit = '元 / 人';
      if (!publishedBread.tutorialChapters?.length) update.tutorialChapters = breadTutorialChapters;
      const seoDescription = '贵阳花溪镇山村窑烤面包DIY体验，78元 / 人，每人一份面团，可自由制作3–6个面包，提供配料与工具。';
      if (!publishedBread.seo) {
        update.seo = { metaTitle: '窑烤面包DIY体验｜78元/人｜贵阳花溪镇山村', metaDescription: seoDescription };
      }
      if (Object.keys(update).length) {
        await tutorialDocuments.update({ documentId: publishedBread.documentId, data: update as any, status: 'published' });
      }
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 6 });
  }

  if (version < 7) {
    const orderedTutorials = [
      { slug: 'bread-diy', title: '窑烤面包 DIY 体验', type: '面包 DIY', sortOrder: 0 },
      { slug: 'pizza-diy', title: '窑烤披萨 DIY 体验', type: '披萨 DIY', sortOrder: 1 },
      { slug: 'cookie-diy', title: '饼干 DIY 体验', type: '饼干 DIY', sortOrder: 2 },
      // 保留旧 slug，避免已分享的 /diy/tie-dye 链接失效。
      { slug: 'tie-dye', title: '蜡染 DIY 体验', type: '蜡染 DIY', sortOrder: 3 },
    ];

    for (const item of orderedTutorials) {
      const existing = await tutorialDocuments.findFirst({ filters: { slug: item.slug }, status: 'published' } as any) as any;
      if (existing) {
        await tutorialDocuments.update({
          documentId: existing.documentId,
          data: { title: item.title, type: item.type, sortOrder: item.sortOrder } as any,
          status: 'published',
        });
      }
    }

    const prioritySlugs = new Set(orderedTutorials.map(item => item.slug));
    const otherTutorials = await tutorialDocuments.findMany({
      filters: { slug: { $notIn: [...prioritySlugs] } },
      status: 'published',
      sort: ['sortOrder:asc'],
    } as any) as any[];
    for (const [index, item] of otherTutorials.entries()) {
      await tutorialDocuments.update({
        documentId: item.documentId,
        data: { sortOrder: index + orderedTutorials.length } as any,
        status: 'published',
      });
    }

    const publishedBread = await tutorialDocuments.findFirst({
      filters: { slug: 'bread-diy' },
      status: 'published',
    } as any) as any;
    const currentSetting = await settingDocuments.findFirst({ populate: ['featuredTutorial'] } as any) as any;
    if (publishedBread && currentSetting?.featuredTutorial?.documentId !== publishedBread.documentId) {
      await settingDocuments.update({
        documentId: currentSetting.documentId,
        data: { featuredTutorial: publishedBread.documentId } as any,
        status: currentSetting.publishedAt ? 'published' : 'draft',
      });
    }

    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 7 });
  }

  if (version < 8) {
    const existingPizza = await tutorialDocuments.findFirst({ filters: { slug: 'pizza-diy' } } as any) as any;
    if (existingPizza) {
      await tutorialDocuments.update({
        documentId: existingPizza.documentId,
        data: {
          title: existingPizza.title || pizzaTutorial.title,
          type: existingPizza.type || pizzaTutorial.type,
          experienceStatus: existingPizza.experienceStatus || pizzaTutorial.experienceStatus,
          summary: existingPizza.summary || pizzaTutorial.summary,
          visible: true,
          sortOrder: 1,
        } as any,
        status: 'published',
      });
    } else {
      await tutorialDocuments.create({ data: pizzaTutorial as any, status: 'published' });
    }

    const finalOrder = ['bread-diy', 'pizza-diy', 'cookie-diy', 'tie-dye'];
    for (const [sortOrder, slug] of finalOrder.entries()) {
      const item = await tutorialDocuments.findFirst({ filters: { slug }, status: 'published' } as any) as any;
      if (item && item.sortOrder !== sortOrder) {
        await tutorialDocuments.update({
          documentId: item.documentId,
          data: { sortOrder } as any,
          status: 'published',
        });
      }
    }

    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 8 });
  }

  if (version < 9) {
    const publishedPizza = await tutorialDocuments.findFirst({
      filters: { slug: 'pizza-diy' },
      status: 'published',
    } as any) as any;
    if (publishedPizza) {
      await tutorialDocuments.update({
        documentId: publishedPizza.documentId,
        data: { detailPrice: 98, detailPriceUnit: '元 / 人' } as any,
        status: 'published',
      });
    }
    await migrationStore.set({ key: 'diy-promotion-migration-version', value: 9 });
  }
}
