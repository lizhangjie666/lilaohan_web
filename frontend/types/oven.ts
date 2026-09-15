import type { ImageAsset } from '~/types/content'

export type OvenBatchStatus = 'preparing' | 'baking' | 'ready' | 'finished'

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

export interface CreateBreadInput {
  nickname: string
  breadName: string
  beforeImage: File
  consent: boolean
}

export const ovenStatusLabels: Record<OvenBatchStatus, string> = {
  preparing: '制作中',
  baking: '烘烤中',
  ready: '已出炉',
  finished: '已结束',
}
