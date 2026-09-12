export interface ImageAsset {
  src: string
  srcset?: string
  width?: number
  height?: number
  alt?: string
}

export type ImageSource = string | ImageAsset

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
  image: ImageSource
  imageAlt: string
}

export interface TutorialStep {
  title: string
  description: string
  image?: ImageSource
  imageAlt?: string
  isIllustration?: boolean
}

export interface DiyResourceItem {
  name: string
  image?: ImageSource
  imageAlt: string
  isIllustration?: boolean
}

export interface DiySetting {
  price: number
  priceUnit: string
  doughPerPerson: string
  breadsPerPerson: string
  bookingGift: string
  featuredTutorialSlug: string
  seoTitle: string
  seoDescription: string
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
  ingredients: DiyResourceItem[]
  tools: DiyResourceItem[]
  steps: TutorialStep[]
  notes: string[]
  image?: ImageSource
  imageAlt: string
  consultationTip?: string
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
  image: ImageSource
  imageAlt: string
  mapUrl: string
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

export interface SiteSettings {
  storeName: string
  brandLogo: ImageSource
  brandLogoAlt: string
  heroTitle: string
  heroIntro: string
  heroImage: ImageSource
  heroImageAlt: string
  homeFireImage: ImageSource
  homeFireImageAlt: string
  menuHeroImage: ImageSource
  menuHeroImageAlt: string
  diyHeroImage: ImageSource
  diyHeroImageAlt: string
  guideHeroImage: ImageSource
  guideHeroImageAlt: string
  address: string
  hours: string
  phone: string
  wechat: string
  wechatQr: ImageSource
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
  heroImage: ImageSource
  heroImageAlt: string
  teamImage: ImageSource
  teamImageAlt: string
  gallery: Array<{ image: ImageSource; alt: string }>
}

export interface PageSectionItem {
  eyebrow?: string
  title: string
  text?: string
  image?: ImageSource
  imageAlt?: string
  buttonText?: string
  buttonLink?: string
}

export interface PageSection {
  sectionName: string
  pageKey: string
  sectionKey: string
  eyebrow: string
  title: string
  description: string
  image: ImageSource
  imageAlt: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  items: PageSectionItem[]
  visible: boolean
  sortOrder: number
}
