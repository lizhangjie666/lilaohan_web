import type { Core } from '@strapi/strapi';

const CONFIRMED_WECHAT = 'lilaohanmianbao_';
const LEGACY_WECHAT = 'lilaohanmianbao';
const XIAOHONGSHU_GUIDE_URL = 'https://xhslink.cn/o/9EYStbt8Pvo';

export async function ensureConfirmedSiteContact(strapi: Core.Strapi) {
  const migrationStore = strapi.store({ type: 'plugin', name: 'lilaohan-content' });
  const version = Number(await migrationStore.get({ key: 'site-contact-migration-version' }) || 0);
  if (version >= 1) return;

  const documents = strapi.documents('api::site-setting.site-setting');
  const published = await documents.findFirst({ status: 'published' } as any) as any;
  if (!published) return;

  const update: Record<string, string> = {};
  const currentWechat = String(published.wechat || '').trim();
  if (!currentWechat || currentWechat === LEGACY_WECHAT) update.wechat = CONFIRMED_WECHAT;
  if (!String(published.xiaohongshuGuideUrl || '').trim()) update.xiaohongshuGuideUrl = XIAOHONGSHU_GUIDE_URL;

  if (Object.keys(update).length) {
    await documents.update({
      documentId: published.documentId,
      data: update as any,
      status: 'published',
    });
  }

  await migrationStore.set({ key: 'site-contact-migration-version', value: 1 });
}
