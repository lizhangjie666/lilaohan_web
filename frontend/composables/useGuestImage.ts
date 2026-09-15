const MAX_SOURCE_BYTES = 20 * 1024 * 1024
const TARGET_BYTES = 2 * 1024 * 1024
const MAX_EDGE = 1600

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
}

export function useGuestImage() {
  async function compressGuestImage(source: File): Promise<File> {
    if (!source.type.startsWith('image/')) throw new Error('请选择手机拍摄或相册中的照片。')
    if (source.size > MAX_SOURCE_BYTES) throw new Error('原始照片超过 20MB，请先在相册中缩小后重试。')

    let bitmap: ImageBitmap
    try {
      bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
    } catch {
      throw new Error('暂时无法读取这张照片，请改用 JPG、PNG 或 WebP 格式。')
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      bitmap.close()
      throw new Error('浏览器暂时无法处理照片，请重新选择。')
    }
    context.fillStyle = '#f5ebdd'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    let quality = 0.84
    let blob = await canvasBlob(canvas, quality)
    while (blob && blob.size > TARGET_BYTES && quality > 0.56) {
      quality -= 0.08
      blob = await canvasBlob(canvas, quality)
    }
    if (!blob) throw new Error('照片压缩失败，请重新选择。')
    if (blob.size > 5 * 1024 * 1024) throw new Error('照片仍然过大，请先裁剪后重试。')

    const safeBase = source.name.replace(/\.[^.]+$/, '').replace(/[^\w\u4e00-\u9fa5-]+/g, '-') || 'bread'
    return new File([blob], `${safeBase}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  }

  return { compressGuestImage }
}
