import type { ImageAsset } from '~/types/content'

export type OvenBatchStatus = 'preparing' | 'baking' | 'ready' | 'finished'
export type OvenOrderStatus = 'processing' | 'ready' | 'collected' | 'cancelled'

export interface OvenOrderPublic {
  customerName: string
  startedAt: string
  estimatedReadyAt: string
  status: OvenOrderStatus
  collectedAt?: string | null
  beforeImage?: ImageAsset
  afterImage?: ImageAsset
  serverTime: string
}

export const ovenOrderStatusLabels: Record<OvenOrderStatus, string> = {
  processing: '制作中',
  ready: '可以取啦',
  collected: '已领取',
  cancelled: '已取消',
}

export interface OvenBatchSummary {
  documentId: string
  batchNumber: string
  batchDate: string
  status: OvenBatchStatus
}

export interface BreadCreationPublic {
  documentId: string
  nickname: string
  breadName: string
  fireCount: number
  beforeImage?: ImageAsset
  afterImage?: ImageAsset
  createdAt: string
  batch: OvenBatchSummary
}

export interface OvenBatchPublic extends OvenBatchSummary {
  creations: BreadCreationPublic[]
}

export const ovenStatusLabels: Record<OvenBatchStatus, string> = {
  preparing: '制作中',
  baking: '烘烤中',
  ready: '已出炉',
  finished: '已结束',
}
