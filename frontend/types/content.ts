export interface Product { id: number; slug: string; name: string; category: string; description: string; price: string; tags: string[]; available: boolean; featured?: boolean; image: string; imageAlt: string }
export interface TutorialStep { title: string; description: string }
export interface Tutorial { id: number; slug: string; title: string; type: string; summary: string; duration: string; people: string; materials: string[]; steps: TutorialStep[]; notes: string[]; image: string; imageAlt: string }
export interface PhotoSpot { id: number; slug: string; name: string; summary: string; bestTime: string; walk: string; direction: string; image: string; imageAlt: string; mapUrl: string }
export interface SiteSettings { storeName: string; address: string; hours: string; phone: string; wechat: string; amapUrl: string; baiduMapUrl: string; parking: string; notice: string }

