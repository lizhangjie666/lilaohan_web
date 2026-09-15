import type { ImageAsset } from '~/types/content'
import type { BreadCreationPublic, OvenBatchPublic, OvenOrderPublic } from '~/types/oven'

type RawMedia = {
  url?: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
  formats?: Record<string, { url?: string; width?: number; height?: number }>
}

const VISITOR_KEY = 'lilaohan_oven_visitor_v1'

function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replace(/-/g, '')
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

function errorMessage(error: any, fallback: string) {
  return String(error?.data?.error?.message || error?.response?._data?.error?.message || error?.message || fallback)
}

export function useOven() {
  const config = useRuntimeConfig()
  const apiBase = String(import.meta.server ? config.strapiUrl : config.public.strapiUrl).replace(/\/$/, '')
  const mediaBase = String(config.public.strapiUrl || '').replace(/\/$/, '')

  function absoluteUrl(url?: string) {
    if (!url) return ''
    if (/^https?:\/\//.test(url)) return url
    return `${mediaBase}${url.startsWith('/') ? '' : '/'}${url}`
  }

  function imageAsset(media?: RawMedia | null): ImageAsset | undefined {
    if (!media?.url) return undefined
    const formats = media.formats || {}
    const variants = ['small', 'medium', 'large']
      .map(key => formats[key])
      .filter(item => item?.url && Number(item.width) > 0)
      .sort((a, b) => Number(a?.width) - Number(b?.width))
    const preferred = formats.large || formats.medium || formats.small || media
    return {
      src: absoluteUrl(preferred.url) || absoluteUrl(media.url),
      srcset: variants.length
        ? variants.map(item => `${absoluteUrl(item?.url)} ${Number(item?.width)}w`).join(', ')
        : undefined,
      width: Number(preferred.width) || Number(media.width) || undefined,
      height: Number(preferred.height) || Number(media.height) || undefined,
      alt: String(media.alternativeText || media.caption || ''),
    }
  }

  function normalizeCreation(raw: any): BreadCreationPublic {
    return {
      ...raw,
      fireCount: Number(raw.fireCount) || 0,
      beforeImage: imageAsset(raw.beforeImage),
      afterImage: imageAsset(raw.afterImage),
    }
  }

  function normalizeBatch(raw: any): OvenBatchPublic {
    return {
      ...raw,
      creations: Array.isArray(raw.creations) ? raw.creations.map(normalizeCreation) : [],
    }
  }

  function normalizeOrder(raw: any): OvenOrderPublic {
    return {
      ...raw,
      beforeImage: imageAsset(raw.beforeImage),
      afterImage: imageAsset(raw.afterImage),
    }
  }

  async function request<T>(path: string, options: any = {}): Promise<T> {
    return await $fetch<T>(`${apiBase}/api/oven${path}`, { timeout: 15000, ...options })
  }

  function visitorId() {
    if (!import.meta.client) return ''
    let value = localStorage.getItem(VISITOR_KEY)
    if (!value) {
      value = randomId()
      localStorage.setItem(VISITOR_KEY, value)
    }
    return value
  }

  return {
    visitorId,

    async lookupOrder(phoneLast4: string) {
      try {
        const result = await request<{ data: any }>('/orders/lookup', {
          method: 'POST',
          body: { phoneLast4 },
        })
        return normalizeOrder(result.data)
      } catch (error) {
        throw new Error(errorMessage(error, '暂时无法查询，请稍后重试。'))
      }
    },

    async today() {
      const result = await request<{ data: any | null }>('/today')
      return { batch: result.data ? normalizeBatch(result.data) : null }
    },

    async batch(batchNumber: string | number) {
      const result = await request<{ data: any }>(`/batches/${encodeURIComponent(String(Number(batchNumber)))}`)
      return normalizeBatch(result.data)
    },

    async creation(documentId: string) {
      const result = await request<{ data: any }>(`/creations/${encodeURIComponent(documentId)}`)
      return normalizeCreation(result.data)
    },

    async track(eventType: 'diy_view' | 'oven_wall_view', batchNumber?: string) {
      if (!import.meta.client) return
      try {
        await request('/events', {
          method: 'POST',
          body: { eventType, anonymousId: visitorId(), batchNumber },
        })
      } catch {
        // 统计失败不应影响现场体验。
      }
    },
  }
}
