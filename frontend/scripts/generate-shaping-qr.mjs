import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import QRCode from 'qrcode'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, '../public/images')
const sourcePhoto = process.argv[2] || process.env.SHAPING_QR_PHOTO
const url = process.env.SHAPING_QR_URL || 'http://122.51.118.103/diy/bread-diy/tutorial#shaping'
const version = process.env.SHAPING_QR_VERSION || 'ip-v1'
const qrName = `bread-shaping-qr-${version}`
const posterName = `bread-shaping-poster-${version}`

if (!sourcePhoto) throw new Error('请传入参考照片路径：npm run generate:shaping-qr -- "照片路径"')
if (!/^https?:\/\/[^\s]+#shaping$/.test(url)) throw new Error('二维码地址必须是带 #shaping 锚点的完整网址。')

await mkdir(outputDirectory, { recursive: true })

const qrOptions = {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: '#211c19', light: '#ffffff' },
}
const qrSvg = await QRCode.toString(url, qrOptions)
const qrBody = qrSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const qrViewBox = qrSvg.match(/viewBox="([^"]+)"/)?.[1]
if (!qrViewBox) throw new Error('无法取得二维码尺寸。')

await QRCode.toFile(path.join(outputDirectory, `${qrName}.png`), url, {
  ...qrOptions,
  type: 'png',
  width: 1600,
})
await writeFile(path.join(outputDirectory, `${qrName}.svg`), qrSvg, 'utf8')

const photoBuffer = await sharp(await readFile(sourcePhoto))
  .rotate()
  .resize(1200, 1450, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer()
const photoDataUrl = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`

const posterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800" viewBox="0 0 1200 1800">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b1714" stop-opacity=".65"/>
      <stop offset=".32" stop-color="#1b1714" stop-opacity=".05"/>
      <stop offset=".7" stop-color="#1b1714" stop-opacity=".08"/>
      <stop offset="1" stop-color="#1b1714" stop-opacity=".72"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1800" fill="#f6ead5"/>
  <image href="${photoDataUrl}" x="0" y="0" width="1200" height="1450"/>
  <rect x="0" y="0" width="1200" height="1450" fill="url(#shade)"/>
  <text x="74" y="110" fill="#f6dfbf" font-family="Arial,sans-serif" font-size="24" font-weight="bold" letter-spacing="7">LILAOHAN · DIY BREAD</text>
  <text x="70" y="220" fill="#fffaf1" font-family="Noto Serif CJK SC,SimSun,serif" font-size="78" font-weight="bold">面包造型篇</text>
  <path d="M74 253h228" stroke="#df805d" stroke-width="8" stroke-linecap="round"/>
  <text x="74" y="1220" fill="#fffaf1" font-family="Noto Serif CJK SC,SimSun,serif" font-size="48" font-weight="bold">每一只面包，</text>
  <text x="74" y="1290" fill="#fffaf1" font-family="Noto Serif CJK SC,SimSun,serif" font-size="48" font-weight="bold">都有自己的样子。</text>
  <path d="M0 1394c0-41 33-74 74-74h1052c41 0 74 33 74 74v406H0z" fill="#f6ead5"/>
  <text x="74" y="1435" fill="#b9573b" font-family="Arial,sans-serif" font-size="22" font-weight="bold" letter-spacing="5">SCAN TO CREATE</text>
  <text x="70" y="1527" fill="#2a211c" font-family="Noto Serif CJK SC,SimSun,serif" font-size="57" font-weight="bold">扫码学造型</text>
  <text x="73" y="1590" fill="#5f5147" font-family="Noto Sans CJK SC,Microsoft YaHei,sans-serif" font-size="29">圆餐包、小兔、花朵、麻花辫……</text>
  <text x="73" y="1638" fill="#5f5147" font-family="Noto Sans CJK SC,Microsoft YaHei,sans-serif" font-size="29">跟着教程，做一只自己的面包。</text>
  <text x="74" y="1740" fill="#8b796b" font-family="Arial,sans-serif" font-size="21">LI LAO HAN · ZHENSHAN VILLAGE</text>
  <rect x="779" y="1368" width="366" height="366" rx="26" fill="#fff" stroke="#decbb0" stroke-width="3"/>
  <svg x="797" y="1386" width="330" height="330" viewBox="${qrViewBox}" shape-rendering="crispEdges">${qrBody}</svg>
</svg>`

await writeFile(path.join(outputDirectory, `${posterName}.svg`), posterSvg, 'utf8')
await sharp(Buffer.from(posterSvg)).png({ compressionLevel: 9 }).toFile(path.join(outputDirectory, `${posterName}.png`))
console.log(`二维码与海报已生成：${qrName}、${posterName}（PNG / SVG）`)
console.log(`扫码目标：${url}`)
