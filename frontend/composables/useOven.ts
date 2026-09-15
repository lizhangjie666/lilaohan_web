import type { ImageAsset } from '~/types/content'
import type { BreadCreationPublic, CreateBreadInput, OvenBatchPublic } from '~/types/oven'

type RawMedia = {
  url?: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
  formats?: Record<string, { url?: string; width?: number; height?: number }>
}

const VISITOR_KEY = 'lilaohan_oven_visitor_v1'
const OWNER_KEY = 'lilaohan_oven_owners_v1'

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

  function saveOwnerToken(documentId: string, token: string) {
    if (!import.meta.client) return
    let values: Record<string, string> = {}
    try { values = JSON.parse(localStorage.getItem(OWNER_KEY) || '{}') } catch {}
    values[documentId] = token
    localStorage.setItem(OWNER_KEY, JSON.stringify(values))
  }

  function ownerToken(documentId: string) {
    if (!import.meta.client) return ''
    try {
      const values = JSON.parse(localStorage.getItem(OWNER_KEY) || '{}')
      return String(values[documentId] || '')
    } catch {
      return ''
    }
  }

  return {
    visitorId,
    ownerToken,

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

    async createCreation(input: CreateBreadInput) {
      const body = new FormData()
      body.append('nickname', input.nickname)
      body.append('breadName', input.breadName)
      body.append('consent', String(input.consent))
      body.append('beforeImage', input.beforeImage, input.beforeImage.name)
      try {
        const result = await request<{ data: any; ownerToken: string }>('/creations', { method: 'POST', body })
        saveOwnerToken(result.data.documentId, result.ownerToken)
        return normalizeCreation(result.data)
      } catch (error) {
        throw new Error(errorMessage(error, '作品暂时没有提交成功，请稍后重试。'))
      }
    },

    async addFire(documentId: string) {
      try {
        const result = await request<{ data: { fireCount: number; added: boolean; alreadyAdded: boolean } }>(
          `/creations/${encodeURIComponent(documentId)}/fire`,
          { method: 'POST', body: { anonymousId: visitorId() } },
        )
        return result.data
      } catch (error) {
        throw new Error(errorMessage(error, '暂时没有添柴成功，请稍后重试。'))
      }
    },

    async uploadAfterImage(documentId: string, image: File) {
      const token = ownerToken(documentId)
      if (!token) throw new Error('请使用最初提交作品的浏览器上传出炉照片。')
      const body = new FormData()
      body.append('ownerToken', token)
      body.append('afterImage', image, image.name)
      try {
        const result = await request<{ data: any }>(
          `/creations/${encodeURIComponent(documentId)}/after-image`,
          { method: 'POST', body },
        )
        return normalizeCreation(result.data)
      } catch (error) {
        throw new Error(errorMessage(error, '出炉照片暂时没有保存成功，请稍后重试。'))
      }
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
