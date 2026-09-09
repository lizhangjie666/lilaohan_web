import type { Core } from '@strapi/strapi';

type FieldText = {
  label: string;
  description?: string;
  placeholder?: string;
};

type ModelLocalization = Record<string, FieldText>;

const contentTypeLocalizations: Record<string, ModelLocalization> = {
  'api::product.product': {
    name: { label: '产品名称', placeholder: '例如：柴火窑烤乡村面包' },
    slug: { label: '网址标识', description: '根据产品名称自动生成，用于产品详情页网址。' },
    category: { label: '产品分类' },
    description: { label: '产品介绍', placeholder: '介绍口味、原料、口感或适合的食用场景。' },
    price: { label: '参考价格', description: '建议同时写明单位，例如“¥28 / 个”；当天价格以门店为准。' },
    tags: { label: '口味标签', description: '点击添加，可填写多条标签。' },
    available: { label: '当日供应' },
    featured: { label: '首页推荐' },
    visible: { label: '官网显示' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
    image: { label: '产品图片' },
    seo: { label: '搜索展示设置' },
  },
  'api::product-category.product-category': {
    name: { label: '分类名称', placeholder: '例如：窑烤面包' },
    slug: { label: '网址标识', description: '根据分类名称自动生成。' },
    description: { label: '分类说明' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
    visible: { label: '官网显示' },
    products: { label: '分类下的产品' },
  },
  'api::diy-tutorial.diy-tutorial': {
    title: { label: '体验名称', placeholder: '例如：亲子窑烤面包 DIY' },
    slug: { label: '网址标识', description: '根据体验名称自动生成，用于教程详情页网址。' },
    type: { label: '体验类型', placeholder: '例如：面包DIY、披萨DIY' },
    summary: { label: '体验简介' },
    duration: { label: '预计时长', placeholder: '例如：约 90 分钟' },
    people: { label: '适合人数', placeholder: '例如：2–8 人' },
    materials: { label: '材料与工具', description: '点击添加，可填写多条内容。' },
    steps: { label: '体验步骤' },
    notes: { label: '注意事项', description: '点击添加，可填写多条内容。' },
    consultationTip: { label: '咨询提示', placeholder: '例如：周末建议提前通过微信咨询。' },
    videoUrl: { label: '演示视频链接', description: '填写以 https:// 开头的抖音、小红书、视频号、B站或其他视频页面链接。' },
    videoLabel: { label: '视频按钮文字', placeholder: '观看演示视频' },
    image: { label: '封面图片' },
    visible: { label: '官网显示' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
    seo: { label: '搜索展示设置' },
  },
  'api::photo-spot.photo-spot': {
    name: { label: '机位名称', placeholder: '填写店主确认过的真实地点名称。' },
    slug: { label: '网址标识', description: '根据机位名称自动生成。' },
    summary: { label: '机位简介' },
    bestTime: { label: '最佳拍摄时间', placeholder: '例如：晴天下午 4 点后' },
    walk: { label: '步行提示', placeholder: '说明从门店出发的真实路线和用时。' },
    direction: { label: '拍摄方向与建议' },
    mapUrl: { label: '地图导航链接', description: '请填写完整的高德或百度地图网址。' },
    image: { label: '示例图片' },
    visible: { label: '官网显示' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
    seo: { label: '搜索展示设置' },
  },
  'api::notice.notice': {
    title: { label: '公告标题' },
    content: { label: '公告内容' },
    type: { label: '公告类型', placeholder: '例如：营业调整、节假日、新品、一般公告' },
    startsAt: { label: '开始显示时间' },
    endsAt: { label: '结束显示时间' },
    featured: { label: '重点公告' },
    visible: { label: '官网显示' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
  },
  'api::faq.faq': {
    question: { label: '问题' },
    answer: { label: '回答' },
    category: { label: '问题分类', placeholder: '例如：到店、DIY、产品' },
    visible: { label: '官网显示' },
    sortOrder: { label: '显示顺序', description: '数字越小越靠前。' },
  },
  'api::site-setting.site-setting': {
    storeName: { label: '店铺名称' },
    heroTitle: { label: '首页主标题' },
    heroIntro: { label: '首页引言' },
    heroImage: { label: '首页主图' },
    homeFireImage: { label: '首页窑炉故事图' },
    menuHeroImage: { label: '菜单页主图' },
    diyHeroImage: { label: '手作体验页主图' },
    guideHeroImage: { label: '打卡指南页主图' },
    address: { label: '完整地址' },
    hours: { label: '营业时间' },
    phone: { label: '咨询电话' },
    wechat: { label: '对外微信号' },
    wechatQr: { label: '微信二维码' },
    amapUrl: { label: '高德地图链接' },
    baiduMapUrl: { label: '百度地图链接' },
    parking: { label: '停车与交通提示' },
    notice: { label: '临时营业提示' },
    socialLinks: { label: '社交账号链接', description: '填写抖音、小红书、视频号等公开账号链接。' },
    seo: { label: '搜索展示设置' },
  },
  'api::story.story': {
    originTitle: { label: '故事标题' },
    origin: { label: '品牌起源' },
    philosophy: { label: '经营理念' },
    process: { label: '窑烤制作过程', description: '以 JSON 格式填写经过确认的制作步骤。' },
    teamIntro: { label: '店主与团队介绍' },
    heroImage: { label: '品牌故事主图' },
    teamImage: { label: '店主与团队图片' },
    gallery: { label: '故事图库' },
    visible: { label: '官网显示' },
    seo: { label: '搜索展示设置' },
  },
};

const componentLocalizations: Record<string, ModelLocalization> = {
  'diy.step': {
    title: { label: '步骤标题' },
    description: { label: '步骤说明' },
    image: { label: '步骤图片' },
  },
  'shared.seo': {
    metaTitle: { label: '搜索标题', description: '建议不超过 60 个字。' },
    metaDescription: { label: '搜索摘要', description: '建议不超过 160 个字。' },
    shareImage: { label: '分享图片' },
  },
  'shared.text-item': {
    value: { label: '内容', placeholder: '请输入一条内容' },
  },
};

const editableContentTypes = Object.keys(contentTypeLocalizations);

function applyFieldTexts(configuration: any, fields: ModelLocalization) {
  const metadatas = { ...(configuration.metadatas ?? {}) };

  for (const [fieldName, text] of Object.entries(fields)) {
    const current = metadatas[fieldName] ?? {};
    metadatas[fieldName] = {
      ...current,
      edit: {
        ...(current.edit ?? {}),
        label: text.label,
        description: text.description ?? current.edit?.description ?? '',
        placeholder: text.placeholder ?? current.edit?.placeholder ?? '',
      },
      list: {
        ...(current.list ?? {}),
        label: text.label,
      },
    };
  }

  return { ...configuration, metadatas };
}

function restoreMissingLayoutFields(configuration: any, fields: ModelLocalization, model: any) {
  const layouts = { ...(configuration.layouts ?? {}) };
  const attributes = model.attributes ?? {};
  const currentEdit = Array.isArray(layouts.edit)
    ? layouts.edit
        .map((row: any[]) => row.filter((cell: any) => attributes[cell.name]))
        .filter((row: any[]) => row.length)
    : [];
  const fieldsInLayout = new Set(
    currentEdit.flatMap((row: any[]) => row.map((cell: any) => cell.name)),
  );
  const missing = Object.keys(fields).filter(
    (fieldName) => attributes[fieldName] && !fieldsInLayout.has(fieldName),
  );
  const required = missing.filter((fieldName) => attributes[fieldName].required);
  const optional = missing.filter((fieldName) => !attributes[fieldName].required);
  const makeRows = (fieldNames: string[]) =>
    fieldNames.map((fieldName) => {
      const attribute = attributes[fieldName];
      const fullWidth =
        ['text', 'richtext', 'json', 'blocks'].includes(attribute.type) ||
        (attribute.type === 'component' && attribute.repeatable);
      return [{ name: fieldName, size: fullWidth ? 12 : 6 }];
    });

  const mainField = configuration.settings?.mainField;
  const currentList = Array.isArray(layouts.list)
    ? layouts.list.filter((fieldName: string) => fieldName === 'id' || attributes[fieldName])
    : [];
  const list =
    mainField && attributes[mainField] && !currentList.includes(mainField)
      ? [mainField, ...currentList.filter((fieldName: string) => fieldName !== 'id')]
      : currentList;

  return {
    ...configuration,
    layouts: {
      ...layouts,
      list,
      // 必填字段放在最前方，避免旧布局隐藏字段后只能看到笼统的发布错误。
      edit: [...makeRows(required), ...currentEdit, ...makeRows(optional)],
    },
  };
}

export function registerChineseAdminDefaults(strapi: Core.Strapi) {
  // 新建后台账号时默认使用简体中文，仍允许用户之后在个人设置中修改。
  strapi.db.lifecycles.subscribe({
    models: ['admin::user'],
    beforeCreate(event) {
      if (!event.params.data.preferedLanguage) {
        event.params.data.preferedLanguage = 'zh-Hans';
      }
    },
  });
}

export async function localizeAdminContent(strapi: Core.Strapi) {
  const contentManager = strapi.plugin('content-manager');
  const contentTypeService = contentManager.service('content-types') as any;
  const componentService = contentManager.service('components') as any;

  await contentTypeService.syncConfigurations();
  await componentService.syncConfigurations();

  for (const [uid, fields] of Object.entries(contentTypeLocalizations)) {
    const model = contentTypeService.findContentType(uid);
    if (!model) continue;

    const current = await contentTypeService.findConfiguration(model);
    const { uid: _uid, ...configuration } = current;
    const localized = applyFieldTexts(configuration, fields);
    await contentTypeService.updateConfiguration(
      model,
      restoreMissingLayoutFields(localized, fields, model),
    );
  }

  for (const [uid, fields] of Object.entries(componentLocalizations)) {
    const component = componentService.findComponent(uid);
    if (!component) continue;

    const current = await componentService.findConfiguration(component);
    const { uid: _uid, category: _category, ...configuration } = current;
    await componentService.updateConfiguration(component, applyFieldTexts(configuration, fields));
  }
}

export async function configureChineseEditorRole(strapi: Core.Strapi) {
  const roleService = (strapi as any).service('admin::role');
  const permissionService = (strapi as any).service('admin::permission');
  const adminContentTypeService = (strapi as any).service('admin::content-type');

  let role = await roleService.findOne({ code: 'strapi-editor' });
  if (!role) {
    role = await roleService.create({
      name: '内容编辑',
      code: 'strapi-editor',
      description: '可以管理和发布门店内容及媒体文件，不能修改系统技术设置。',
    });
  } else if (
    role.name !== '内容编辑' ||
    role.description !== '可以管理和发布门店内容及媒体文件，不能修改系统技术设置。'
  ) {
    role = await roleService.update(
      { id: role.id },
      {
        name: '内容编辑',
        description: '可以管理和发布门店内容及媒体文件，不能修改系统技术设置。',
      },
    );
  }

  const contentActions = permissionService.actionProvider
    .values()
    .filter((action: any) => action.section === 'contentTypes');
  const restrictedSubjects = Object.keys(strapi.contentTypes).filter(
    (uid) => !editableContentTypes.includes(uid),
  );
  const contentPermissions = adminContentTypeService.getPermissionsWithNestedFields(contentActions, {
    restrictedSubjects,
  });
  const mediaPermissions = [
    { action: 'plugin::upload.read' },
    { action: 'plugin::upload.assets.create' },
    { action: 'plugin::upload.assets.update' },
    { action: 'plugin::upload.assets.download' },
    { action: 'plugin::upload.assets.copy-link' },
  ];

  await roleService.assignPermissions(role.id, [...contentPermissions, ...mediaPermissions]);
}

export async function configurePublicReadPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
    populate: ['permissions'],
  });
  if (!publicRole) {
    strapi.log.warn('未找到公开访问角色，官网内容接口权限未初始化');
    return;
  }

  const readableActions = new Set(
    editableContentTypes.flatMap((uid) => [`${uid}.find`, `${uid}.findOne`]),
  );
  const isManagedAction = (action: string) =>
    editableContentTypes.some((uid) => action.startsWith(`${uid}.`));

  for (const permission of publicRole.permissions ?? []) {
    if (isManagedAction(permission.action) && !readableActions.has(permission.action)) {
      await strapi.db.query('plugin::users-permissions.permission').delete({
        where: { id: permission.id },
      });
    }
  }

  const existingActions = new Set(
    (publicRole.permissions ?? []).map((permission: { action: string }) => permission.action),
  );
  for (const action of readableActions) {
    if (existingActions.has(action)) continue;
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    });
  }
}

export async function setExistingAdminsToChinese(strapi: Core.Strapi) {
  const users = await strapi.db.query('admin::user').findMany({
    select: ['id', 'preferedLanguage'],
  });

  for (const user of users) {
    if (user.preferedLanguage === 'zh-Hans') continue;
    await strapi.db.query('admin::user').update({
      where: { id: user.id },
      data: { preferedLanguage: 'zh-Hans' },
    });
  }
}
