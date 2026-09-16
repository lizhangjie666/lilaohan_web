import fs from 'node:fs/promises';
import path from 'node:path';
import type { Core } from '@strapi/strapi';
import sharp from 'sharp';

type UploadFile = {
  id: number;
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number | string;
  url?: string;
  formats?: Record<string, any> | null;
};

const WEB_VARIANTS = [
  { key: 'webSmall', width: 480, prefix: 'web_small' },
  { key: 'webMedium', width: 800, prefix: 'web_medium' },
] as const;

function isLargePng(file: UploadFile) {
  return file.mime === 'image/png' && Number(file.size || 0) >= 250 && Boolean(file.hash && file.url);
}

function safeUploadPath(publicDir: string, url: string) {
  const uploadsDir = path.resolve(publicDir, 'uploads');
  const resolved = path.resolve(publicDir, url.replace(/^\/+/, ''));
  return resolved.startsWith(`${uploadsDir}${path.sep}`) ? resolved : '';
}

async function buildWebVariant(inputPath: string, outputPath: string, width: number) {
  const info = await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82, effort: 4, smartSubsample: true })
    .toFile(outputPath);

  return info;
}

async function optimizeUploadFile(strapi: Core.Strapi, file: UploadFile) {
  if (!isLargePng(file)) return false;

  const publicDir = (strapi.dirs as any).static.public as string;
  const inputPath = safeUploadPath(publicDir, String(file.url));
  if (!inputPath) return false;
  try {
    await fs.access(inputPath);
  } catch {
    return false;
  }

  const formats = { ...(file.formats || {}) };
  let changed = false;

  for (const variant of WEB_VARIANTS) {
    const hash = `${variant.prefix}_${file.hash}`;
    const filename = `${hash}.webp`;
    const url = `/uploads/${filename}`;
    const outputPath = safeUploadPath(publicDir, url);
    if (!outputPath) continue;

    const existing = formats[variant.key];
    if (existing?.url === url) {
      try {
        await fs.access(outputPath);
        continue;
      } catch {
        // 数据库仍有记录但文件丢失时重新生成。
      }
    }

    const info = await buildWebVariant(inputPath, outputPath, variant.width);
    formats[variant.key] = {
      name: `${path.parse(file.name || String(file.hash)).name}-${variant.width}.webp`,
      hash,
      ext: '.webp',
      mime: 'image/webp',
      path: null,
      width: info.width,
      height: info.height,
      size: Number((info.size / 1000).toFixed(2)),
      sizeInBytes: info.size,
      url,
    };
    changed = true;
  }

  if (!changed) return false;
  await strapi.db.query('plugin::upload.file').update({
    where: { id: file.id },
    data: { formats },
  } as any);
  return true;
}

export function registerUploadOptimization(strapi: Core.Strapi) {
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    async afterCreate(event) {
      try {
        await optimizeUploadFile(strapi, event.result as UploadFile);
      } catch (error) {
        strapi.log.warn(`上传图片 WebP 优化失败：${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });
}

export async function optimizeExistingUploads(strapi: Core.Strapi) {
  const files = await strapi.db.query('plugin::upload.file').findMany({} as any) as UploadFile[];
  let optimized = 0;
  for (let index = 0; index < files.length; index += 2) {
    const batch = files.slice(index, index + 2);
    const results = await Promise.all(batch.map(file => optimizeUploadFile(strapi, file).catch((error) => {
      strapi.log.warn(`历史图片 WebP 优化失败（${file.id}）：${error instanceof Error ? error.message : String(error)}`);
      return false;
    })));
    optimized += results.filter(Boolean).length;
  }
  if (optimized) strapi.log.info(`已为 ${optimized} 张历史 PNG 生成轻量 WebP 响应图`);
}
