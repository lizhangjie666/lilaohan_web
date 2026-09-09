import { fallbackProducts, fallbackSettings, fallbackSpots, fallbackTutorials } from '~/data/fallback'
import type { PhotoSpot, Product, SiteSettings, Story, StoryStage, Tutorial, TutorialStep } from '~/types/content'

type RawRecord = Record<string, any>
type Entity = RawRecord & { id?: number; attributes?: RawRecord }

const emptySettings: SiteSettings = {
  storeName: '李老汉窑烤面包',
  heroTitle: '在镇山村，等一炉面包慢慢出炉。',
  heroIntro: '柴火、面团与村子的慢时间。来吃一口刚出炉，也亲手做一份带走。',
  heroImage: '/images/home-hero.jpg',
  heroImageAlt: '李老汉窑烤面包店内庭院与窑炉',
  homeFireImage: '/images/home-hero.jpg',
  homeFireImageAlt: '李老汉窑烤面包店内窑炉与庭院',
  menuHeroImage: '/images/home-hero.jpg',
  menuHeroImageAlt: '李老汉窑烤面包店内庭院',
  diyHeroImage: '/images/home-hero.jpg',
  diyHeroImageAlt: '李老汉窑烤面包店内手作空间',
  guideHeroImage: '/images/home-hero.jpg',
  guideHeroImageAlt: '李老汉窑烤面包所在的镇山村门店庭院',
  address: '贵州省贵阳市花溪区镇山村（门牌号待店主确认）',
  hours: '营业时间待店主确认',
  phone: '',
  wechat: '',
  wechatQr: '',
  wechatQrAlt: '李老汉窑烤面包微信二维码',
  amapUrl: '',
  baiduMapUrl: '',
  parking: '停车及进村路线待店主确认',
  notice: '产品供应与营业安排请以门店当天信息为准。',
}

const emptyStory: Story = {
  originTitle: '故事从镇山村和一炉火开始',
  origin: '品牌起源和店主故事正在整理中，只会发布经过店主确认的真实内容。',
  philosophy: '',
  process: [],
  teamIntro: '店主与团队介绍正在整理中。',
  heroImage: '/images/home-hero.jpg',
  heroImageAlt: '李老汉窑烤面包店内庭院与窑炉',
  teamImage: '/images/home-hero.jpg',
  teamImageAlt: '李老汉窑烤面包店内环境',
  gallery: [],
}

function flatten(item: Entity | null | undefined): RawRecord {
  if (!item) return {}
  return item.attributes ? { id: item.id, ...item.attributes } : item
}

function unwrapMedia(value: any): RawRecord {
  if (!value) return {}
  if (value.data) return flatten(Array.isArray(value.data) ? value.data[0] : value.data)
  return flatten(value)
}

function mediaUrl(value: any, base = ''): string {
  const media = unwrapMedia(value)
  if (typeof media.url !== 'string') return ''
  if (/^https?:\/\//.test(media.url)) return media.url
  return base ? `${base}${media.url.startsWith('/') ? '' : '/'}${media.url}` : media.url
}

function mediaAlt(value: any): string {
  const media = unwrapMedia(value)
  return String(media.alternativeText || media.caption || '')
}

function textItems(value: any): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map(item => typeof item === 'string' ? item : String(item?.value || ''))
    .filter(Boolean)
}

function normalizeProduct(entity: Entity, mediaBase = ''): Product {
  const item = flatten(entity)
  const category = flatten(item.category?.data ?? item.category)
  return {
    id: Number(item.id || 0),
    slug: String(item.slug || ''),
    name: String(item.name || ''),
    category: String(category.name || ''),
    description: String(item.description || ''),
    price: String(item.price || '价格待确认'),
    tags: textItems(item.tags),
    available: item.available !== false,
    featured: item.featured === true,
    image: mediaUrl(item.image, mediaBase),
    imageAlt: mediaAlt(item.image) || String(item.name || '菜单产品图片'),
  }
}

function normalizeStep(value: RawRecord, mediaBase = ''): TutorialStep {
  return {
    title: String(value.title || ''),
    description: String(value.description || ''),
    image: mediaUrl(value.image, mediaBase) || undefined,
    imageAlt: mediaAlt(value.image) || String(value.title || '手作步骤图片'),
  }
}

function normalizeTutorial(entity: Entity, mediaBase = ''): Tutorial {
  const item = flatten(entity)
  return {
    id: Number(item.id || 0),
    slug: String(item.slug || ''),
    title: String(item.title || ''),
    type: String(item.type || ''),
    summary: String(item.summary || ''),
    duration: String(item.duration || ''),
    people: String(item.people || ''),
    materials: textItems(item.materials),
    steps: Array.isArray(item.steps) ? item.steps.map((step: RawRecord) => normalizeStep(step, mediaBase)) : [],
    notes: textItems(item.notes),
    image: mediaUrl(item.image, mediaBase),
    imageAlt: mediaAlt(item.image) || String(item.title || '手作体验图片'),
    videoUrl: typeof item.videoUrl === 'string' && item.videoUrl.startsWith('https://') ? item.videoUrl : undefined,
    videoLabel: String(item.videoLabel || '观看演示视频'),
  }
}

function normalizeSpot(entity: Entity, mediaBase = ''): PhotoSpot {
  const item = flatten(entity)
  return {
    id: Number(item.id || 0),
    slug: String(item.slug || ''),
    name: String(item.name || ''),
    summary: String(item.summary || ''),
    bestTime: String(item.bestTime || ''),
    walk: String(item.walk || ''),
    direction: String(item.direction || ''),
    image: mediaUrl(item.image, mediaBase),
    imageAlt: mediaAlt(item.image) || String(item.name || '镇山村打卡图片'),
    mapUrl: String(item.mapUrl || ''),
  }
}

function normalizeSettings(entity: Entity, mediaBase = ''): SiteSettings {
  const item = flatten(entity)
  const image = (key: string, fallback: string) => mediaUrl(item[key], mediaBase) || fallback
  const alt = (imageKey: string, fallback: string) => mediaAlt(item[imageKey]) || fallback

  return {
    ...emptySettings,
    storeName: String(item.storeName || emptySettings.storeName),
    heroTitle: String(item.heroTitle || emptySettings.heroTitle),
    heroIntro: String(item.heroIntro || emptySettings.heroIntro),
    heroImage: image('heroImage', emptySettings.heroImage),
    heroImageAlt: alt('heroImage', emptySettings.heroImageAlt),
    homeFireImage: image('homeFireImage', emptySettings.homeFireImage),
    homeFireImageAlt: alt('homeFireImage', emptySettings.homeFireImageAlt),
    menuHeroImage: image('menuHeroImage', emptySettings.menuHeroImage),
    menuHeroImageAlt: alt('menuHeroImage', emptySettings.menuHeroImageAlt),
    diyHeroImage: image('diyHeroImage', emptySettings.diyHeroImage),
    diyHeroImageAlt: alt('diyHeroImage', emptySettings.diyHeroImageAlt),
    guideHeroImage: image('guideHeroImage', emptySettings.guideHeroImage),
    guideHeroImageAlt: alt('guideHeroImage', emptySettings.guideHeroImageAlt),
    address: String(item.address || emptySettings.address),
    hours: String(item.hours || emptySettings.hours),
    phone: String(item.phone || ''),
    wechat: String(item.wechat || ''),
    wechatQr: mediaUrl(item.wechatQr, mediaBase),
    wechatQrAlt: alt('wechatQr', emptySettings.wechatQrAlt),
    amapUrl: String(item.amapUrl || ''),
    baiduMapUrl: String(item.baiduMapUrl || ''),
    parking: String(item.parking || emptySettings.parking),
    notice: String(item.notice || emptySettings.notice),
  }
}

function normalizeStory(entity: Entity, mediaBase = ''): Story {
  const item = flatten(entity)
  const rawStages = Array.isArray(item.process) ? item.process : []
  const process: StoryStage[] = rawStages
    .map((stage: RawRecord, index: number) => ({
      n: String(stage.n || String(index + 1).padStart(2, '0')),
      title: String(stage.title || ''),
      text: String(stage.text || stage.description || ''),
    }))
    .filter((stage: StoryStage) => stage.title || stage.text)
  const galleryItems = Array.isArray(item.gallery?.data) ? item.gallery.data : Array.isArray(item.gallery) ? item.gallery : []

  return {
    ...emptyStory,
    originTitle: String(item.originTitle || emptyStory.originTitle),
    origin: String(item.origin || emptyStory.origin),
    philosophy: String(item.philosophy || ''),
    process,
    teamIntro: String(item.teamIntro || emptyStory.teamIntro),
    heroImage: mediaUrl(item.heroImage, mediaBase) || emptyStory.heroImage,
    heroImageAlt: mediaAlt(item.heroImage) || emptyStory.heroImageAlt,
    teamImage: mediaUrl(item.teamImage, mediaBase) || emptyStory.teamImage,
    teamImageAlt: mediaAlt(item.teamImage) || emptyStory.teamImageAlt,
    gallery: galleryItems
      .map((media: any, index: number) => ({
        url: mediaUrl(media, mediaBase),
        alt: mediaAlt(media) || `李老汉窑烤面包故事图片 ${index + 1}`,
      }))
      .filter((media: { url: string }) => media.url),
  }
}

export function useContent() {
  const config = useRuntimeConfig()
  const apiBase = String(import.meta.server ? config.strapiUrl : config.public.strapiUrl).replace(/\/$/, '')
  const mediaBase = String(config.public.strapiUrl || '').replace(/\/$/, '')
  const isDevelopment = import.meta.dev

  async function request(path: string): Promise<any> {
    return await $fetch(`${apiBase}/api/${path}`, { timeout: 5000 })
  }

  async function getCollection<T>(
    path: string,
    normalize: (entity: Entity) => T,
    fallback: T[],
    populateQuery = 'populate=*',
  ): Promise<T[]> {
    try {
      const query = `filters[visible][$eq]=true&sort=sortOrder:asc&${populateQuery}`
      const result = await request(`${path}?${query}`) as { data?: Entity[] }
      return Array.isArray(result.data) ? result.data.map(normalize) : []
    } catch {
      return isDevelopment ? fallback : []
    }
  }

  async function getSingle<T>(
    path: string,
    normalize: (entity: Entity) => T,
    fallback: T,
  ): Promise<T> {
    try {
      const result = await request(`${path}?populate=*`) as { data?: Entity }
      return result.data ? normalize(result.data) : fallback
    } catch {
      return fallback
    }
  }

  return {
    products: () => getCollection(
      'products',
      entity => normalizeProduct(entity, mediaBase),
      fallbackProducts,
      'populate[category]=true&populate[image]=true&populate[tags]=true',
    ),
    tutorials: () => getCollection(
      'diy-tutorials',
      entity => normalizeTutorial(entity, mediaBase),
      fallbackTutorials,
      'populate[image]=true&populate[materials]=true&populate[notes]=true&populate[steps][populate][image]=true',
    ),
    spots: () => getCollection('photo-spots', entity => normalizeSpot(entity, mediaBase), fallbackSpots),
    settings: () => getSingle('site-setting', entity => normalizeSettings(entity, mediaBase), emptySettings),
    story: () => getSingle('story', entity => normalizeStory(entity, mediaBase), emptyStory),
  }
}
