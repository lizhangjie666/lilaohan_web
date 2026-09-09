import type { Core } from '@strapi/strapi';

type DefaultSection = {
  sectionName: string;
  pageKey: string;
  sectionKey: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  items?: Array<{ eyebrow?: string; title: string; text?: string; buttonText?: string; buttonLink?: string }>;
  sortOrder: number;
};

const homeMenuItems = [
  { eyebrow: '01', title: '窑烤面包', text: '柴火慢烤，感受面团出炉后的焦香。', buttonText: '查看菜单', buttonLink: '/menu' },
  { eyebrow: '02', title: '窑烤披萨', text: '高温窑炉烤出微焦边缘，适合一起分享。', buttonText: '查看菜单', buttonLink: '/menu' },
  { eyebrow: '03', title: '窑炉烤鸡', text: '以当天备料和窑炉安排为准。', buttonText: '查看菜单', buttonLink: '/menu' },
  { eyebrow: '04', title: '咖啡', text: '配刚出炉的面包，也配村里的慢时光。', buttonText: '查看菜单', buttonLink: '/menu' },
  { eyebrow: '05', title: '围炉煮茶', text: '天凉时围火而坐，茶点随季节调整。', buttonText: '查看菜单', buttonLink: '/menu' },
  { eyebrow: '06', title: '冷饮', text: '逛村途中清爽歇脚，口味随季节更新。', buttonText: '查看菜单', buttonLink: '/menu' },
];

const defaults: DefaultSection[] = [
  { sectionName: '全站联系引导', pageKey: 'global', sectionKey: 'global.contact', eyebrow: 'PLAN YOUR VISIT', title: '火已经生起，等你进村。', primaryButtonText: '一键导航', primaryButtonLink: '/visit', secondaryButtonText: '电话咨询', secondaryButtonLink: '/visit#contact', sortOrder: 10 },
  { sectionName: '全站页脚品牌介绍', pageKey: 'global', sectionKey: 'global.footer', title: '等一炉面包，逛一座村子。', description: '贵州省贵阳市花溪区镇山村 · 店铺门牌、营业时间与联系方式请以后台发布内容为准。', sortOrder: 20 },
  { sectionName: '全站页脚图片说明', pageKey: 'global', sectionKey: 'global.photo-credit', eyebrow: 'PHOTO CREDIT', description: '临时素材来源说明。正式上线前请替换为门店与镇山村实拍，并在这里更新说明。', sortOrder: 30 },
  { sectionName: '首页·首屏', pageKey: 'home', sectionKey: 'home.hero', eyebrow: 'GUIYANG · ZHENSHAN VILLAGE', primaryButtonText: '看看今天吃什么', primaryButtonLink: '/menu', secondaryButtonText: '导航到店', secondaryButtonLink: '/visit', sortOrder: 0 },
  { sectionName: '首页·窑火故事', pageKey: 'home', sectionKey: 'home.fire', eyebrow: '01 · 看见一炉火', title: '不是追求快，\n是把火候交给时间。', description: '添柴、看火、等待。窑炉里的高温让面包和披萨长出微焦的边，也让每一次出炉都有一点不同。我们把制作过程留在你看得见的地方。', primaryButtonText: '认识我们的窑炉 →', primaryButtonLink: '/story', sortOrder: 10 },
  { sectionName: '首页·招牌菜单', pageKey: 'home', sectionKey: 'home.menu', eyebrow: '02 · 刚出炉的味道', title: '今天，想从哪一口开始？', primaryButtonText: '查看完整窑烤菜单 →', primaryButtonLink: '/menu', items: homeMenuItems, sortOrder: 20 },
  { sectionName: '首页·手作体验', pageKey: 'home', sectionKey: 'home.diy', eyebrow: '03 · 亲手做一次', title: '把“我来过”\n变成“我做过”。', description: '揉面、铺料、等待出炉。手作体验不是观看节目，而是一起完成一份可以吃掉的旅行记忆。', primaryButtonText: '查看手作教程', primaryButtonLink: '/diy', sortOrder: 30 },
  { sectionName: '首页·镇山村指南', pageKey: 'home', sectionKey: 'home.guide', eyebrow: '04 · WALK INTO THE VILLAGE', title: '从店里出发，\n走进镇山村。', description: '把等面包出炉的时间，留给湖边、石板路和村子的风。所有机位将在店主实地核实后正式发布。', primaryButtonText: '打开半日打卡指南 →', primaryButtonLink: '/guide', sortOrder: 40 },
  { sectionName: '菜单页·页头', pageKey: 'menu', sectionKey: 'menu.hero', eyebrow: 'WOOD-FIRED MENU', title: '窑里今天，正在发生什么。', description: '菜单随出炉节奏、季节和当天备料更新。页面价格为参考，具体供应请以门店当天为准。', sortOrder: 10 },
  { sectionName: '菜单页·空状态', pageKey: 'menu', sectionKey: 'menu.empty', title: '当前菜单待更新', description: '门店正在整理当天供应内容，出发前可通过电话或微信咨询。', primaryButtonText: '联系门店', primaryButtonLink: '/visit#contact', sortOrder: 20 },
  { sectionName: '手作页·页头', pageKey: 'diy', sectionKey: 'diy.hero', eyebrow: 'MAKE IT YOURSELF', title: '这一次，换你来做。', description: '从面团到出炉，每一步都能亲手参与。教程用于出发前了解流程，实际体验安排请提前联系门店确认。', primaryButtonText: '咨询手作体验', primaryButtonLink: '/visit#contact', sortOrder: 10 },
  { sectionName: '手作页·空状态', pageKey: 'diy', sectionKey: 'diy.empty', title: '手作体验正在整理', description: '具体体验项目和时间请先联系门店确认。', sortOrder: 20 },
  { sectionName: '指南页·页头', pageKey: 'guide', sectionKey: 'guide.hero', eyebrow: 'A HALF-DAY WALK', title: '等一炉面包，也逛一座村子。', description: '这是一条从店里出发、再回到窑火旁的轻松路线。点位经店主确认后再按导航前往。', sortOrder: 10 },
  { sectionName: '指南页·路线提示', pageKey: 'guide', sectionKey: 'guide.overview', items: [{ eyebrow: '建议时长', title: '半日慢游' }, { eyebrow: '建议顺序', title: '店里 → 村中 → 湖边 → 回店' }, { eyebrow: '拍摄提醒', title: '文明拍摄', text: '尊重居民生活，不进入私人空间，不阻塞道路。' }], sortOrder: 20 },
  { sectionName: '指南页·空状态', pageKey: 'guide', sectionKey: 'guide.empty', title: '打卡机位正在整理', description: '请以店主实地确认后的路线为准。', sortOrder: 30 },
  { sectionName: '指南页·返店引导', pageKey: 'guide', sectionKey: 'guide.return', title: '逛完村子，回来等一炉面包。', primaryButtonText: '看看今天吃什么', primaryButtonLink: '/menu', sortOrder: 40 },
  { sectionName: '故事页·页头', pageKey: 'story', sectionKey: 'story.hero', eyebrow: 'OUR FIRE, OUR VILLAGE', title: '在村里生一炉火，做当天的面包。', sortOrder: 10 },
  { sectionName: '故事页·品牌起源', pageKey: 'story', sectionKey: 'story.origin', eyebrow: '为什么在这里', sortOrder: 20 },
  { sectionName: '故事页·制作过程', pageKey: 'story', sectionKey: 'story.process', eyebrow: '从生火到出炉', title: '一炉面包的日常', sortOrder: 30 },
  { sectionName: '故事页·团队介绍', pageKey: 'story', sectionKey: 'story.team', eyebrow: 'THE PEOPLE BEHIND THE OVEN', title: '做面包的人，\n也在过村里的日常。', sortOrder: 40 },
  { sectionName: '到店页·页头', pageKey: 'visit', sectionKey: 'visit.hero', eyebrow: 'PLAN YOUR VISIT', title: '进村、找火、等出炉。', description: '出发前请查看营业公告和当天供应。完整门牌、营业时间、停车路线与联系方式需要店主确认后在后台发布。', primaryButtonText: '高德地图导航', secondaryButtonText: '拨打电话', sortOrder: 10 },
  { sectionName: '到店页·地址与营业', pageKey: 'visit', sectionKey: 'visit.info', eyebrow: '地址与营业', title: '李老汉窑烤面包', sortOrder: 20 },
  { sectionName: '到店页·联系门店', pageKey: 'visit', sectionKey: 'visit.contact', eyebrow: '联系门店', title: '咨询DIY或当天供应', sortOrder: 30 },
  { sectionName: '到店页·常见问题', pageKey: 'visit', sectionKey: 'visit.faq', eyebrow: 'BEFORE YOU COME', title: '到店前常见问题', sortOrder: 40 },
  { sectionName: '产品详情·操作文字', pageKey: 'product-detail', sectionKey: 'product-detail.actions', primaryButtonText: '查看到店方式', primaryButtonLink: '/visit', description: '以门店当天供应为准', sortOrder: 10 },
  { sectionName: '教程详情·准备内容', pageKey: 'diy-detail', sectionKey: 'diy-detail.preparation', eyebrow: '准备内容', sortOrder: 10 },
  { sectionName: '教程详情·体验流程', pageKey: 'diy-detail', sectionKey: 'diy-detail.steps', eyebrow: '体验流程', sortOrder: 20 },
  { sectionName: '教程详情·注意事项', pageKey: 'diy-detail', sectionKey: 'diy-detail.notes', title: '体验前请留意', sortOrder: 30 }
];

export async function ensureDefaultPageSections(strapi: Core.Strapi) {
  const documents = strapi.documents('api::page-section.page-section');

  for (const section of defaults) {
    const existing = await documents.findFirst({ filters: { sectionKey: section.sectionKey } });
    if (existing) continue;
    await documents.create({ data: { ...section, visible: true }, status: 'published' });
  }

  // 仅对旧版本创建、且尚未配置品类小项的首页菜单板块补齐一次默认内容。
  // 迁移版本写入 Strapi Store，后续重启不会覆盖店主在后台的增删修改。
  const migrationStore = strapi.store({ type: 'plugin', name: 'lilaohan-content' });
  const migrationVersion = Number(await migrationStore.get({ key: 'page-section-migration-version' }) || 0);
  if (migrationVersion < 2) {
    const homeMenu = await documents.findFirst({ filters: { sectionKey: 'home.menu' }, populate: ['items'] });
    if (homeMenu && (!Array.isArray(homeMenu.items) || homeMenu.items.length === 0)) {
      await documents.update({
        documentId: homeMenu.documentId,
        // Docker 构建时不会携带 Strapi 本地生成的类型文件，运行时模型仍会校验组件结构。
        data: { items: homeMenuItems } as any,
        status: 'published',
      });
    }
    await migrationStore.set({ key: 'page-section-migration-version', value: 2 });
  }

  // 第 4 版补上后续新增的“围炉煮茶”代表产品。
  // 已经由店主选择过代表产品的卡片只保留原关联，不会被默认值覆盖。
  if (migrationVersion < 4) {
    const homeMenu = await documents.findFirst({
      filters: { sectionKey: 'home.menu' },
      populate: { items: { populate: ['image', 'representativeProduct'] } },
    } as any) as any;
    const representativeProductNames: Record<string, string> = {
      '窑烤面包': '南瓜土司',
      '窑烤披萨': '爆浆榴莲披萨',
      '窑炉烤鸡': '窑烤大鸡腿',
      '咖啡': '拿铁',
      '围炉煮茶': '围炉煮茶',
      '冷饮': '特调气泡养乐多',
    };

    if (homeMenu && Array.isArray(homeMenu.items)) {
      const productDocuments = strapi.documents('api::product.product');
      const productByCategory = new Map<string, any>();
      for (const [categoryTitle, productName] of Object.entries(representativeProductNames)) {
        const product = await productDocuments.findFirst({ filters: { name: productName }, status: 'published' });
        if (product) productByCategory.set(categoryTitle, product);
      }

      const items = homeMenu.items.map((item: any) => {
        const product = productByCategory.get(item.title);
        return {
          id: item.id,
          eyebrow: item.eyebrow,
          title: item.title,
          text: item.text,
          buttonText: item.buttonText,
          buttonLink: item.buttonLink,
          ...(item.image ? { image: item.image.id ?? item.image } : {}),
          ...(item.representativeProduct
            ? { representativeProduct: item.representativeProduct.documentId ?? item.representativeProduct }
            : product
              ? { representativeProduct: product.documentId }
              : {}),
        };
      });

      await documents.update({ documentId: homeMenu.documentId, data: { items }, status: 'published' } as any);
    }
    await migrationStore.set({ key: 'page-section-migration-version', value: 4 });
  }
}
