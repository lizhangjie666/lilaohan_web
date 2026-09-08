// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      phone: process.env.NUXT_PUBLIC_PHONE || '',
      wechat: process.env.NUXT_PUBLIC_WECHAT || '',
      amapUrl: process.env.NUXT_PUBLIC_AMAP_URL || '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: '%s · 李老汉窑烤面包',
      meta: [
        { name: 'theme-color', content: '#211C19' },
        { name: 'description', content: '贵州贵阳花溪镇山村里的窑烤面包、披萨、手作体验与村落打卡指南。' },
      ],
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/menu': { prerender: true },
    '/diy': { prerender: true },
    '/guide': { prerender: true },
    '/story': { prerender: true },
    '/visit': { prerender: true },
  },
})
