import { fallbackProducts, fallbackSettings, fallbackSpots, fallbackTutorials } from '~/data/fallback'
import type { PhotoSpot, Product, SiteSettings, Tutorial } from '~/types/content'

type Entity<T> = { id: number; documentId?: string; attributes?: T } & T

function flatten<T>(item: Entity<T>): T {
  return item.attributes ? { id: item.id, ...item.attributes } as T : item as T
}

export function useContent() {
  const config = useRuntimeConfig()
  const base = String(config.public.strapiUrl).replace(/\/$/, '')

  async function getCollection<T>(path: string, fallback: T[]): Promise<T[]> {
    try {
      const result = await $fetch<{ data: Entity<T>[] }>(`${base}/api/${path}`, { query: { populate: '*', sort: 'sortOrder:asc' }, timeout: 2500 })
      return result.data?.length ? result.data.map(flatten) : fallback
    } catch { return fallback }
  }

  async function getSingle<T>(path: string, fallback: T): Promise<T> {
    try {
      const result = await $fetch<{ data: Entity<T> }>(`${base}/api/${path}`, { query: { populate: '*' }, timeout: 2500 })
      return result.data ? flatten(result.data) : fallback
    } catch { return fallback }
  }

  return {
    products: () => getCollection<Product>('products', fallbackProducts),
    tutorials: () => getCollection<Tutorial>('diy-tutorials', fallbackTutorials),
    spots: () => getCollection<PhotoSpot>('photo-spots', fallbackSpots),
    settings: () => getSingle<SiteSettings>('site-setting', fallbackSettings),
  }
}
