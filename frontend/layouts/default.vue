<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { settings, pageSections } = useContent()
const [{ data: site }, { data: globalSections }] = await Promise.all([
  useAsyncData('layout-settings', settings),
  useAsyncData('layout-sections', () => pageSections('global')),
])
const footer = computed(() => globalSections.value?.find(item => item.sectionKey === 'global.footer'))
const photoCredit = computed(() => globalSections.value?.find(item => item.sectionKey === 'global.photo-credit'))
const open = ref(false)
watch(() => route.fullPath, () => { open.value = false })
const nav = [
  { to: '/menu', label: '窑烤菜单' },
  { to: '/diy', label: '手作体验' },
  { to: '/guide', label: '镇山指南' },
  { to: '/story', label: '关于我们' },
  { to: '/visit', label: '到店指南' },
]
</script>

<template>
  <div class="min-h-screen pb-20 md:pb-0">
    <header class="sticky top-0 z-50 border-b border-ink/10 bg-flour/95 backdrop-blur">
      <div class="page-wrap flex h-18 items-center justify-between py-3">
        <NuxtLink to="/" class="group flex items-center gap-3" aria-label="返回首页">
          <img :src="site?.brandLogo || '/images/brand-avatar.jpg'" :alt="site?.brandLogoAlt || '李老汉窑烤面包品牌头像'" class="h-11 w-11 rounded-full border border-ink/10 object-cover transition group-hover:scale-105">
          <span><b class="block font-serif text-lg leading-none">{{ site?.storeName || '李老汉窑烤面包' }}</b><small class="mt-1 block text-[11px] tracking-[0.18em] text-charcoal">ZHENSHAN · GUIYANG</small></span>
        </NuxtLink>
        <nav class="hidden items-center gap-7 lg:flex" aria-label="主导航">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="text-sm font-semibold transition hover:text-fire" active-class="text-fire">{{ item.label }}</NuxtLink>
        </nav>
        <button class="grid h-11 w-11 place-items-center rounded-full border border-ink/20 lg:hidden" :aria-expanded="open" aria-label="打开导航" @click="open = !open">
          <span class="text-xl">{{ open ? '×' : '☰' }}</span>
        </button>
      </div>
      <nav v-if="open" class="page-wrap grid gap-1 border-t border-ink/10 py-3 lg:hidden" aria-label="移动端导航">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="rounded-xl px-3 py-3 font-semibold hover:bg-ink/5">{{ item.label }}</NuxtLink>
      </nav>
    </header>

    <main><slot /></main>

    <footer class="bg-ink pb-24 pt-14 text-flour md:pb-14">
      <div class="page-wrap grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><img v-if="footer?.image" :src="footer.image" :alt="footer.imageAlt" class="mb-5 h-20 w-20 rounded-full object-cover"><p class="whitespace-pre-line font-serif text-3xl">{{ footer?.title || '等一炉面包，逛一座村子。' }}</p><p class="mt-4 max-w-md whitespace-pre-line text-sm leading-7 text-flour/65">{{ footer?.description || site?.address }}</p></div>
        <div><p class="text-xs tracking-[0.2em] text-flour/50">EXPLORE</p><div class="mt-4 grid gap-3 text-sm"><NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="hover:text-[#ef8a69]">{{ item.label }}</NuxtLink></div></div>
        <div><p class="text-xs tracking-[0.2em] text-flour/50">{{ photoCredit?.eyebrow || 'PHOTO CREDIT' }}</p><p class="mt-4 whitespace-pre-line text-xs leading-6 text-flour/55">{{ photoCredit?.description || '正式上线前请逐步替换为门店与镇山村实拍。' }}</p></div>
      </div>
    </footer>

    <div class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-ink/10 bg-flour p-2 shadow-2xl md:hidden">
      <a :href="config.public.amapUrl || '/visit'" class="rounded-full px-2 py-3 text-center text-sm font-semibold">地图导航</a>
      <a :href="config.public.phone ? `tel:${config.public.phone}` : '/visit'" class="rounded-full px-2 py-3 text-center text-sm font-semibold">电话咨询</a>
      <NuxtLink to="/visit#wechat" class="rounded-full bg-fire px-2 py-3 text-center text-sm font-semibold text-white">添加微信</NuxtLink>
    </div>
  </div>
</template>
