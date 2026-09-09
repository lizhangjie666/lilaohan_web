import type { PageSection } from '~/types/content'

type SectionInput = Partial<PageSection> & Pick<PageSection, 'sectionKey'>

function section(sectionKey: string, value: Omit<SectionInput, 'sectionKey'>): PageSection {
  return {
    sectionName: '', pageKey: sectionKey.split('.')[0], sectionKey,
    eyebrow: '', title: '', description: '', image: '', imageAlt: '',
    primaryButtonText: '', primaryButtonLink: '', secondaryButtonText: '', secondaryButtonLink: '',
    items: [], visible: true, sortOrder: 0, ...value,
  }
}

export const pageSectionDefaults: Record<string, PageSection> = {
  'global.contact': section('global.contact', { eyebrow: 'PLAN YOUR VISIT', title: '火已经生起，等你进村。', primaryButtonText: '一键导航', primaryButtonLink: '/visit', secondaryButtonText: '电话咨询', secondaryButtonLink: '/visit#contact' }),
  'global.footer': section('global.footer', { title: '等一炉面包，逛一座村子。', description: '贵州省贵阳市花溪区镇山村 · 店铺门牌、营业时间与联系方式请以后台发布内容为准。' }),
  'global.photo-credit': section('global.photo-credit', { eyebrow: 'PHOTO CREDIT', description: '临时素材来源说明。正式上线前请替换为门店与镇山村实拍，并在这里更新说明。' }),
  'home.hero': section('home.hero', { eyebrow: 'GUIYANG · ZHENSHAN VILLAGE', primaryButtonText: '看看今天吃什么', primaryButtonLink: '/menu', secondaryButtonText: '导航到店', secondaryButtonLink: '/visit' }),
  'home.fire': section('home.fire', { eyebrow: '01 · 看见一炉火', title: '不是追求快，\n是把火候交给时间。', description: '添柴、看火、等待。窑炉里的高温让面包和披萨长出微焦的边，也让每一次出炉都有一点不同。我们把制作过程留在你看得见的地方。', primaryButtonText: '认识我们的窑炉 →', primaryButtonLink: '/story' }),
  'home.menu': section('home.menu', {
    eyebrow: '02 · 刚出炉的味道',
    title: '今天，想从哪一口开始？',
    primaryButtonText: '查看完整窑烤菜单 →',
    primaryButtonLink: '/menu',
    items: [
      { eyebrow: '01', title: '窑烤面包', text: '柴火慢烤，感受面团出炉后的焦香。', buttonText: '查看菜单', buttonLink: '/menu' },
      { eyebrow: '02', title: '窑烤披萨', text: '高温窑炉烤出微焦边缘，适合一起分享。', buttonText: '查看菜单', buttonLink: '/menu' },
      { eyebrow: '03', title: '窑炉烤鸡', text: '以当天备料和窑炉安排为准。', buttonText: '查看菜单', buttonLink: '/menu' },
      { eyebrow: '04', title: '咖啡', text: '配刚出炉的面包，也配村里的慢时光。', buttonText: '查看菜单', buttonLink: '/menu' },
      { eyebrow: '05', title: '围炉煮茶', text: '天凉时围火而坐，茶点随季节调整。', buttonText: '查看菜单', buttonLink: '/menu' },
      { eyebrow: '06', title: '冷饮', text: '逛村途中清爽歇脚，口味随季节更新。', buttonText: '查看菜单', buttonLink: '/menu' },
    ],
  }),
  'home.diy': section('home.diy', { eyebrow: '03 · 亲手做一次', title: '把“我来过”\n变成“我做过”。', description: '揉面、铺料、等待出炉。手作体验不是观看节目，而是一起完成一份可以吃掉的旅行记忆。', primaryButtonText: '查看手作教程', primaryButtonLink: '/diy' }),
  'home.guide': section('home.guide', { eyebrow: '04 · WALK INTO THE VILLAGE', title: '从店里出发，\n走进镇山村。', description: '把等面包出炉的时间，留给湖边、石板路和村子的风。所有机位将在店主实地核实后正式发布。', primaryButtonText: '打开半日打卡指南 →', primaryButtonLink: '/guide' }),
  'menu.hero': section('menu.hero', { eyebrow: 'WOOD-FIRED MENU', title: '窑里今天，正在发生什么。', description: '菜单随出炉节奏、季节和当天备料更新。页面价格为参考，具体供应请以门店当天为准。' }),
  'menu.empty': section('menu.empty', { title: '当前菜单待更新', description: '门店正在整理当天供应内容，出发前可通过电话或微信咨询。', primaryButtonText: '联系门店', primaryButtonLink: '/visit#contact' }),
  'diy.hero': section('diy.hero', { eyebrow: 'MAKE IT YOURSELF', title: '这一次，换你来做。', description: '从面团到出炉，每一步都能亲手参与。教程用于出发前了解流程，实际体验安排请提前联系门店确认。', primaryButtonText: '咨询手作体验', primaryButtonLink: '/visit#contact' }),
  'diy.empty': section('diy.empty', { title: '手作体验正在整理', description: '具体体验项目和时间请先联系门店确认。' }),
  'guide.hero': section('guide.hero', { eyebrow: 'A HALF-DAY WALK', title: '等一炉面包，也逛一座村子。', description: '这是一条从店里出发、再回到窑火旁的轻松路线。点位经店主确认后再按导航前往。' }),
  'guide.overview': section('guide.overview', { items: [{ eyebrow: '建议时长', title: '半日慢游' }, { eyebrow: '建议顺序', title: '店里 → 村中 → 湖边 → 回店' }, { eyebrow: '拍摄提醒', title: '文明拍摄', text: '尊重居民生活，不进入私人空间，不阻塞道路。' }] }),
  'guide.empty': section('guide.empty', { title: '打卡机位正在整理', description: '请以店主实地确认后的路线为准。' }),
  'guide.return': section('guide.return', { title: '逛完村子，回来等一炉面包。', primaryButtonText: '看看今天吃什么', primaryButtonLink: '/menu' }),
  'story.hero': section('story.hero', { eyebrow: 'OUR FIRE, OUR VILLAGE', title: '在村里生一炉火，做当天的面包。' }),
  'story.origin': section('story.origin', { eyebrow: '为什么在这里' }),
  'story.process': section('story.process', { eyebrow: '从生火到出炉', title: '一炉面包的日常' }),
  'story.team': section('story.team', { eyebrow: 'THE PEOPLE BEHIND THE OVEN', title: '做面包的人，\n也在过村里的日常。' }),
  'visit.hero': section('visit.hero', { eyebrow: 'PLAN YOUR VISIT', title: '进村、找火、等出炉。', description: '出发前请查看营业公告和当天供应。完整门牌、营业时间、停车路线与联系方式需要店主确认后在后台发布。', primaryButtonText: '高德地图导航', secondaryButtonText: '拨打电话' }),
  'visit.info': section('visit.info', { eyebrow: '地址与营业', title: '李老汉窑烤面包' }),
  'visit.contact': section('visit.contact', { eyebrow: '联系门店', title: '咨询DIY或当天供应' }),
  'visit.faq': section('visit.faq', { eyebrow: 'BEFORE YOU COME', title: '到店前常见问题' }),
  'product-detail.actions': section('product-detail.actions', { description: '以门店当天供应为准', primaryButtonText: '查看到店方式', primaryButtonLink: '/visit' }),
  'diy-detail.preparation': section('diy-detail.preparation', { eyebrow: '准备内容' }),
  'diy-detail.steps': section('diy-detail.steps', { eyebrow: '体验流程' }),
  'diy-detail.notes': section('diy-detail.notes', { title: '体验前请留意' }),
}

export function mergePageSections(records: PageSection[] | null | undefined, keys: string[]) {
  const available = new Map((records || []).map(item => [item.sectionKey, item]))
  return Object.fromEntries(keys.map(key => [key.split('.').at(-1)!, available.get(key) || pageSectionDefaults[key]])) as Record<string, PageSection>
}
