export interface Product {
  id: number
  slug: string
  name: string
  category: string
  description: string
  price: string
  tags: string[]
  available: boolean
  featured?: boolean
  image: string
  imageAlt: string
}

export interface TutorialStep {
  title: string
  description: string
  image?: string
  imageAlt?: string
}

export interface Tutorial {
  id: number
  slug: string
  title: string
  type: string
  summary: string
  duration: string
  people: string
  materials: string[]
  steps: TutorialStep[]
  notes: string[]
  image: string
  imageAlt: string
  videoUrl?: string
  videoLabel?: string
}

export interface PhotoSpot {
  id: number
  slug: string
  name: string
  summary: string
  bestTime: string
  walk: string
  direction: string
  image: string
  imageAlt: string
  mapUrl: string
}

export interface SiteSettings {
  storeName: string
  heroTitle: string
  heroIntro: string
  heroImage: string
  heroImageAlt: string
  homeFireImage: string
  homeFireImageAlt: string
  menuHeroImage: string
  menuHeroImageAlt: string
  diyHeroImage: string
  diyHeroImageAlt: string
  guideHeroImage: string
  guideHeroImageAlt: string
  address: string
  hours: string
  phone: string
  wechat: string
  wechatQr: string
  wechatQrAlt: string
  amapUrl: string
  baiduMapUrl: string
  parking: string
  notice: string
}

export interface StoryStage {
  n?: string
  title: string
  text: string
}

export interface Story {
  originTitle: string
  origin: string
  philosophy: string
  process: StoryStage[]
  teamIntro: string
  heroImage: string
  heroImageAlt: string
  teamImage: string
  teamImageAlt: string
  gallery: Array<{ url: string; alt: string }>
}
