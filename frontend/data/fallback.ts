import type { PhotoSpot, Product, SiteSettings, Tutorial } from '~/types/content'

export const images = {
  village: 'https://upload.wikimedia.org/wikipedia/commons/0/03/1_sanjiang_dong_2017.jpg',
  fire: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Brick-oven-thumbnail.jpg',
  bread: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Artisan_Loaves_of_Bread_%28Unsplash%29.jpg',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591a?auto=format&fit=crop&w=1800&q=86',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=86',
}

export const fallbackSettings: SiteSettings = {
  storeName: '李老汉窑烤面包',
  address: '贵州省贵阳市花溪区镇山村（门牌号待店主确认）',
  hours: '营业时间待店主确认',
  phone: '',
  wechat: '',
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

export const fallbackTutorials: Tutorial[] = [
  { id: 1, slug: 'bread-diy', title: '亲手做一只窑烤面包', type: '面包 DIY', summary: '从认识面团、整形到送进窑炉，带走一份自己参与完成的出炉记忆。', duration: '时长待确认', people: '亲子、朋友、团建；接待人数待确认', materials: ['面团与配料由门店准备', '围裙与基础工具', '成品包装'], steps: [{ title: '认识面团', description: '了解当天面团状态与窑烤方式。' }, { title: '整形与装饰', description: '在指导下完成整形和表面装饰。' }, { title: '入窑烘烤', description: '由工作人员操作窑炉，等待面包上色。' }, { title: '出炉带走', description: '拍照、品尝并带走自己的作品。' }], notes: ['具体流程以门店现场安排为准', '儿童需由监护人陪同', '如有食物过敏，请提前告知'], image: images.bread, imageAlt: '手作面包氛围示意图，待替换为真实DIY照片' },
  { id: 2, slug: 'pizza-diy', title: '做一张属于自己的窑烤披萨', type: '披萨 DIY', summary: '擀开面团、挑选配料、亲手铺满，再看它在窑火里快速鼓起。', duration: '时长待确认', people: '亲子、朋友、团建；接待人数待确认', materials: ['披萨面团', '当日配料', '围裙与基础工具'], steps: [{ title: '擀开面团', description: '学习把面团整理成适合入窑的形状。' }, { title: '铺上配料', description: '按照口味选择当天可用的配料。' }, { title: '送入窑炉', description: '由工作人员完成高温窑炉操作。' }, { title: '一起分享', description: '出炉后切开品尝，记录自己的成品。' }], notes: ['配料会随季节和库存调整', '高温窑炉区域请听从工作人员指引'], image: images.pizza, imageAlt: '披萨制作氛围示意图，待替换为真实DIY照片' },
]

export const fallbackSpots: PhotoSpot[] = [
  { id: 1, slug: 'lakeside', name: '湖边开阔机位', summary: '把水面、远山和村落一起放进画面。具体点位需店主核实后发布。', bestTime: '建议清晨或日落前，待实地确认', walk: '从门店出发步行时间待确认', direction: '顺光拍环境，逆光拍人物轮廓', image: images.village, imageAlt: '湖边山村氛围示意图，并非镇山村实拍', mapUrl: '' },
  { id: 2, slug: 'stone-lane', name: '村中石板路', summary: '适合记录村落尺度与行走感，请尊重当地居民生活。', bestTime: '建议上午，待实地确认', walk: '从门店出发路线待确认', direction: '使用竖构图，保留石墙与道路延伸感', image: images.village, imageAlt: '村落氛围示意图，并非镇山村实拍', mapUrl: '' },
  { id: 3, slug: 'store-fire', name: '店内窑炉边', summary: '等待出炉时，记录火光、木柴和手作过程。拍摄前请先征得工作人员同意。', bestTime: '以当天生火和出炉时间为准', walk: '就在店内', direction: '靠近但不进入操作区，用侧光捕捉蒸汽与火色', image: images.fire, imageAlt: '窑火氛围示意图，待替换为门店窑炉实拍', mapUrl: '' },
]
