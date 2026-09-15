import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'

const siteUrl = process.env.HOMEPAGE_QR_URL || 'http://122.51.118.103/'
const version = process.env.HOMEPAGE_QR_VERSION || 'ip-v1'
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, '../public/images')
const baseName = `homepage-qr-${version}`

await mkdir(outputDirectory, { recursive: true })

const commonOptions = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: {
    dark: '#211c19',
    light: '#fffaf2',
  },
}

await QRCode.toFile(path.join(outputDirectory, `${baseName}.png`), siteUrl, {
  ...commonOptions,
  type: 'png',
  width: 1600,
})

const svg = await QRCode.toString(siteUrl, {
  ...commonOptions,
  type: 'svg',
})
await writeFile(path.join(outputDirectory, `${baseName}.svg`), svg, 'utf8')

console.log(`已生成 ${baseName}.png 和 ${baseName}.svg，目标：${siteUrl}`)
