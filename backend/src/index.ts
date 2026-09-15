import type { Core } from '@strapi/strapi';

import {
  configureChineseEditorRole,
  configurePublicReadPermissions,
  localizeAdminContent,
  registerChineseAdminDefaults,
  setExistingAdminsToChinese,
} from './admin-localization';
import { ensureDefaultPageSections } from './page-section-defaults';
import { ensureDefaultDiyContent } from './diy-defaults';
import { registerOvenOrderAdmin } from './oven-order-admin';
import { assertOvenPhoneEncryptionConfigured, ensureOvenOrderCounter, purgeExpiredOvenPhones, syncOverdueOvenOrders } from './oven-orders';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    registerChineseAdminDefaults(strapi);
    registerOvenOrderAdmin(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    assertOvenPhoneEncryptionConfigured();
    await ensureOvenOrderCounter(strapi);
    strapi.cron.add({
      ovenOrderReadySync: {
        task: async () => { await syncOverdueOvenOrders(strapi); },
        options: '0 * * * * *',
      },
      ovenOrderPhonePurge: {
        task: async () => { await purgeExpiredOvenPhones(strapi); },
        options: '0 15 3 * * *',
      },
    });
    await ensureDefaultPageSections(strapi);
    await ensureDefaultDiyContent(strapi);
    await localizeAdminContent(strapi);
    await configureChineseEditorRole(strapi);
    await configurePublicReadPermissions(strapi);
    await setExistingAdminsToChinese(strapi);
    strapi.log.info('后台简体中文界面和内容编辑角色已初始化');
  },
};
