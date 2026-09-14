import type { PhotoSpot, Product, SiteSettings, Tutorial, TutorialChapter } from '~/types/content'

export const images = {
  village: 'https://upload.wikimedia.org/wikipedia/commons/0/03/1_sanjiang_dong_2017.jpg',
  fire: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Brick-oven-thumbnail.jpg',
  bread: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Artisan_Loaves_of_Bread_%28Unsplash%29.jpg',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591a?auto=format&fit=crop&w=1800&q=86',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=86',
}

export const fallbackSettings: SiteSettings = {
  storeName: '李老汉窑烤面包',
  brandLogo: '/images/brand-avatar.jpg',
  brandLogoAlt: '李老汉窑烤面包品牌头像',
  heroTitle: '在镇山村，等一炉面包慢慢出炉。',
  heroIntro: '柴火、面团与村子的慢时间。来吃一口刚出炉，也亲手做一份带走。',
  heroImage: '/images/home-hero.jpg',
  heroImageAlt: '李老汉窑烤面包店内庭院与窑炉',
  homeFireImage: images.fire,
  homeFireImageAlt: '砖窑火焰氛围示意图，待替换为门店实拍',
  menuHeroImage: images.bread,
  menuHeroImageAlt: '手工面包氛围示意图，待替换为门店实拍',
  diyHeroImage: images.pizza,
  diyHeroImageAlt: '披萨手作氛围示意图，待替换为门店DIY实拍',
  guideHeroImage: images.village,
  guideHeroImageAlt: '中国西南山村氛围示意图，并非镇山村实拍',
  address: '贵州省贵阳市花溪区镇山村（门牌号待店主确认）',
  hours: '营业时间待店主确认',
  phone: '',
  wechat: '',
  wechatQr: '',
  wechatQrAlt: '李老汉窑烤面包微信二维码',
  amapUrl: '',
  baiduMapUrl: '',
  parking: '停车及进村路线待店主确认',
  notice: '官网试运行中，产品供应与营业安排请以门店当天信息为准。',
}

export const fallbackProducts: Product[] = [
  { id: 1, slug: 'wood-fired-bread', name: '窑烤面包', category: '窑烤面包', description: '柴火慢烤，等面团在窑里长出焦香的外壳。具体口味与出炉时间以当天为准。', price: '价格待确认', tags: ['柴火窑烤', '每日出炉'], available: true, featured: true, image: images.bread, imageAlt: '手工面包氛围示意图，待替换为门店实拍' },
  { id: 2, slug: 'wood-fired-pizza', name: '窑烤披萨', category: '窑烤披萨', description: '现场铺料、送入高温窑炉，边缘微焦，适合朋友一起分享。', price: '价格待确认', tags: ['现点现烤', '适合分享'], available: true, featured: true, image: images.pizza, imageAlt: '窑烤披萨氛围示意图，待替换为门店实拍' },
  { id: 3, slug: 'roast-chicken', name: '窑炉烤鸡', category: '窑炉烤鸡', description: '窑火锁住肉汁，需以当天备料与供应情况为准。', price: '价格待确认', tags: ['窑炉慢烤', '建议咨询'], available: true, image: images.fire, imageAlt: '窑火氛围示意图，待替换为烤鸡实拍' },
  { id: 4, slug: 'coffee', name: '咖啡', category: '咖啡', description: '一杯咖啡，配刚出炉的面包，也配村里的慢时光。', price: '价格待确认', tags: ['冷热可选'], available: true, image: images.coffee, imageAlt: '咖啡氛围示意图，待替换为门店实拍' },
  { id: 5, slug: 'tea-by-the-fire', name: '围炉煮茶', category: '围炉煮茶', description: '天凉时围火而坐，茶点组合与开放季节以门店公告为准。', price: '价格待确认', tags: ['季节限定', '围炉'], available: true, image: images.fire, imageAlt: '炉火氛围示意图，待替换为围炉煮茶实拍' },
  { id: 6, slug: 'cold-drinks', name: '冷饮', category: '冷饮', description: '适合逛村途中短暂停留，口味随季节更新。', price: '价格待确认', tags: ['季节更新'], available: true, image: images.village, imageAlt: '山村夏日氛围示意图，待替换为冷饮实拍' },
]

const breadTutorialChapters: TutorialChapter[] = [
  {
    anchor: 'oven', eyebrow: 'OVEN KNOWLEDGE', title: '窑炉科普篇',
    summary: '先认识热量如何被窑体储存和释放，再理解黑窑、白窑的结构差异。这里介绍通用知识，不代表门店窑炉的具体类型。',
    imageAlt: '窑炉科普篇图片',
    lessons: [
      { title: '蓄热式窑炉如何工作', description: '窑体先吸收燃烧产生的热量，再通过热辐射、传导和热空气把热量缓慢释放给食物。火熄灭后，厚重窑体仍能继续烘烤。', imageAlt: '蓄热式窑炉原理图片', steps: ['生火加热窑体', '让耐火材料充分蓄热', '按窑炉结构整理燃烧区', '利用稳定余热烘烤'], safetyNote: '' },
      { title: '黑窑：火在烘烤室里燃烧', description: '黑窑的火焰和高温烟气会经过烘烤室。传统使用方式通常在窑体蓄热后移走燃料和灰烬，再利用余热烘烤；“黑”描述的是直接燃烧方式，不是外观颜色。', imageAlt: '黑窑结构说明图片', steps: [], safetyNote: '' },
      { title: '白窑：火与烘烤室分开', description: '白窑的燃烧室与烘烤室分开，热量通过窑体或独立烟道传递，燃烧烟气不直接进入烘烤室；“白”同样不是外观颜色。', imageAlt: '白窑结构说明图片', steps: [], safetyNote: '' },
      { title: '黑窑与白窑有什么不同', description: '核心差别是火焰与烟气是否直接经过烘烤室。两种结构各有使用场景，不能只凭名称判断优劣，也不能据此推断门店使用的是哪一种。', imageAlt: '黑窑与白窑差异图片', steps: [], safetyNote: '' },
      { title: '窑炉安全', description: '窑门、窑壁、烤盘和周边工具都可能保持高温。体验者应与操作区保持距离，入窑、转盘和出窑均由工作人员完成。', imageAlt: '窑炉安全说明图片', steps: [], safetyNote: '儿童必须由成人陪同；不要触碰窑门、窑壁、余烬及刚出炉的烤盘。' },
    ],
  },
  {
    anchor: 'tools', eyebrow: 'TOOLS & SAFETY', title: '工具使用篇',
    summary: '认识擀面杖和切面刀，先学会安全、轻柔地使用工具，再开始塑造面团。', imageAlt: '面包工具使用篇图片',
    lessons: [
      { title: '擀面杖', description: '用于把面团擀开、控制厚薄和整理形状。不要一开始就用力压薄，以免排出过多气体或让厚薄失控。', imageAlt: '擀面杖使用图片', steps: ['面团轻轻拍扁', '从中间向外短距离擀压', '转动面团检查厚薄', '达到造型需要后停止'], safetyNote: '操作时给手指留出空间，儿童应在成人指导下使用。' },
      { title: '切面刀 / 面团刮板', description: '用于分割面团、托起柔软面团和清理台面。它更适合向下利落分割，不要像锯子一样来回拉扯。', imageAlt: '切面刀和面团刮板使用图片', steps: ['握稳手柄', '确认另一只手离开切线', '刀口垂直向下一次分割', '用宽面托起或移动面团'], safetyNote: '放下时刀口朝下并远离桌边；儿童使用切面刀必须由成人全程指导。' },
    ],
  },
  {
    anchor: 'shaping', eyebrow: 'SHAPING CLASS', title: '面包造型篇',
    summary: '从基础圆餐包开始，再尝试小兔、花朵、麻花辫和花环。造型不必一模一样，连接牢固、大小均匀更重要。', imageAlt: '面包造型教学篇图片',
    lessons: [
      { title: '圆餐包', description: '最基础也最适合第一次练习的造型，重点是收紧表面并把收口藏到底部。', imageAlt: '圆餐包造型教学图片', steps: ['面团轻轻拍平', '边缘依次向中心折叠', '捏紧收口并翻面', '手掌呈杯状轻轻滚圆'], safetyNote: '不要过度揉搓，避免面团表面撕裂。' },
      { title: '小兔', description: '用圆润主体和一对长耳朵表现小兔，五官可以用少量配料点缀。', imageAlt: '小兔面包造型教学图片', steps: ['先整理出圆润主体', '在顶部剪开或接上两只耳朵', '轻轻拉长并压出耳窝', '用少量配料装饰眼睛和鼻子'], safetyNote: '耳朵与主体连接处要压紧，配料不要放得过密。' },
      { title: '花朵', description: '把圆面团均匀分成花瓣，适合在中心加入少量果干或肉松。', imageAlt: '花朵面包造型教学图片', steps: ['面团滚圆并稍稍压扁', '沿边缘均匀标出花瓣位置', '切出花瓣但保留中心相连', '轻转花瓣并装饰花心'], safetyNote: '切割时保持间距，中心不要切断。' },
      { title: '麻花辫', description: '三股面条交替编织，粗细一致能让成品发酵和上色更均匀。', imageAlt: '麻花辫面包造型教学图片', steps: ['把面团分成三等份', '搓成长度和粗细接近的长条', '顶部捏合后交替编织', '尾端捏紧并收到底部'], safetyNote: '编织不要拉得太紧，要给发酵膨胀留出空间。' },
      { title: '花环', description: '先做长条或麻花辫，再首尾相接成为圆环，适合加上少量果干装饰。', imageAlt: '花环面包造型教学图片', steps: ['搓出均匀长条或编好麻花辫', '弯成圆环并确认大小', '首尾重叠后捏紧接口', '整理圆度并点缀配料'], safetyNote: '接口要充分压紧，否则发酵和烘烤时容易分开。' },
    ],
  },
]

export const fallbackTutorials: Tutorial[] = [
  { id: 1, slug: 'bread-diy', title: '窑烤面包 DIY 体验', type: '面包 DIY', experienceStatus: '开放体验', summary: '每人一份面团，自由做出3–6个喜欢的造型，等待窑火把创意烤成香喷喷的面包。', duration: '约110分钟', people: '亲子家庭、儿童、情侣、朋友和周末游客', detailPrice: 78, detailPriceUnit: '元 / 人', materials: ['面团由门店提前完成和面与第一次发酵', '基础配料与制作工具由门店准备', '成品提供包装，可自行带走'], ingredients: [], tools: [], steps: [{ title: '领取面团', description: '领取门店提前和好并完成第一次发酵的面团。' }, { title: '自由造型', description: '用约30分钟把面团做成喜欢的造型。' }, { title: '添加配料', description: '加入当天准备的配料，完成口味和表面装饰。' }, { title: '发酵', description: '让完成造型的面包继续发酵约40分钟。' }, { title: '窑炉烤制', description: '由工作人员安全操作窑炉，烤制约20分钟。' }, { title: '冷却', description: '面包出炉后冷却约20分钟，等待香气与口感稳定。' }, { title: '打包带走', description: '装好自己的作品，把香喷喷的面包带回家。' }], tutorialChapters: breadTutorialChapters, notes: ['儿童体验需由监护人陪同', '高温窑炉由工作人员操作，请勿自行靠近', '如有食物过敏，请在预约时提前告知'], image: images.bread, imageAlt: '手作面包氛围示意图，待替换为真实DIY照片' },
  { id: 2, slug: 'pizza-diy', title: '窑烤披萨 DIY 体验', type: '披萨 DIY', experienceStatus: '开放体验', summary: '擀开面团、挑选配料、亲手铺满，再看它在窑火里快速鼓起。', duration: '时长待确认', people: '亲子、朋友、团建；接待人数待确认', materials: ['披萨面团', '当日配料', '围裙与基础工具'], ingredients: [], tools: [], steps: [{ title: '擀开面团', description: '学习把面团整理成适合入窑的形状。' }, { title: '铺上配料', description: '按照口味选择当天可用的配料。' }, { title: '送入窑炉', description: '由工作人员完成高温窑炉操作。' }, { title: '一起分享', description: '出炉后切开品尝，记录自己的成品。' }], tutorialChapters: [], notes: ['配料会随季节和库存调整', '高温窑炉区域请听从工作人员指引'], image: images.pizza, imageAlt: '披萨制作氛围示意图，待替换为真实DIY照片' },
  { id: 3, slug: 'cookie-diy', title: '饼干 DIY 体验', type: '饼干 DIY', experienceStatus: '内容筹备中', summary: '项目内容正在筹备中，具体开放时间与体验安排请添加门店微信咨询。', duration: '', people: '', materials: [], ingredients: [], tools: [], steps: [], tutorialChapters: [], notes: [], imageAlt: '饼干 DIY 体验图片' },
  { id: 4, slug: 'tie-dye', title: '蜡染 DIY 体验', type: '蜡染 DIY', experienceStatus: '内容筹备中', summary: '项目内容正在筹备中，具体开放时间与体验安排请添加门店微信咨询。', duration: '', people: '', materials: [], ingredients: [], tools: [], steps: [], tutorialChapters: [], notes: [], imageAlt: '蜡染 DIY 体验图片' },
]

export const fallbackSpots: PhotoSpot[] = [
  { id: 1, slug: 'lakeside', name: '湖边开阔机位', summary: '把水面、远山和村落一起放进画面。具体点位需店主核实后发布。', bestTime: '建议清晨或日落前，待实地确认', walk: '从门店出发步行时间待确认', direction: '顺光拍环境，逆光拍人物轮廓', image: images.village, imageAlt: '湖边山村氛围示意图，并非镇山村实拍', mapUrl: '' },
  { id: 2, slug: 'stone-lane', name: '村中石板路', summary: '适合记录村落尺度与行走感，请尊重当地居民生活。', bestTime: '建议上午，待实地确认', walk: '从门店出发路线待确认', direction: '使用竖构图，保留石墙与道路延伸感', image: images.village, imageAlt: '村落氛围示意图，并非镇山村实拍', mapUrl: '' },
  { id: 3, slug: 'store-fire', name: '店内窑炉边', summary: '等待出炉时，记录火光、木柴和手作过程。拍摄前请先征得工作人员同意。', bestTime: '以当天生火和出炉时间为准', walk: '就在店内', direction: '靠近但不进入操作区，用侧光捕捉蒸汽与火色', image: images.fire, imageAlt: '窑火氛围示意图，待替换为门店窑炉实拍', mapUrl: '' },
]
