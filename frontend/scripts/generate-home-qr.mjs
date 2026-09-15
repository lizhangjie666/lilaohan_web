import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, '../public/images')

await mkdir(outputDirectory, { recursive: true })

const commonOptions = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: {
    dark: '#211c19',
    light: '#fffaf2',
  },
}

const qrCodes = [
  {
    baseName: `homepage-qr-${process.env.HOMEPAGE_QR_VERSION || 'ip-v1'}`,
    url: process.env.HOMEPAGE_QR_URL || 'http://122.51.118.103/',
  },
  {
    baseName: `oven-progress-qr-${process.env.OVEN_PROGRESS_QR_VERSION || 'ip-v1'}`,
    url: process.env.OVEN_PROGRESS_QR_URL || 'http://122.51.118.103/oven/today',
  },
]

for (const qrCode of qrCodes) {
  await QRCode.toFile(path.join(outputDirectory, `${qrCode.baseName}.png`), qrCode.url, {
    ...commonOptions,
    type: 'png',
    width: 1600,
  })

  const svg = await QRCode.toString(qrCode.url, {
    ...commonOptions,
    type: 'svg',
  })
  await writeFile(path.join(outputDirectory, `${qrCode.baseName}.svg`), svg, 'utf8')
  console.log(`已生成 ${qrCode.baseName}.png 和 ${qrCode.baseName}.svg，目标：${qrCode.url}`)
}
