<script setup lang="ts">
import { mergePageSections, pageSectionDefaults } from '~/data/page-sections'

const { tutorials, spots, settings, pageSections } = useContent()
const [{ data: tutorialList }, { data: spotList }, { data: site }, { data: sectionList }] = await Promise.all([
  useAsyncData('home-tutorials', tutorials), useAsyncData('home-spots', spots), useAsyncData('home-settings', settings), useAsyncData('home-sections', () => pageSections('home')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['home.hero', 'home.fire', 'home.menu', 'home.diy', 'home.guide']))
const menuCategories = computed(() => blocks.value.menu.items.length ? blocks.value.menu.items : pageSectionDefaults['home.menu'].items)
const heroReady = ref(false)
const progressBar = ref<HTMLElement | null>(null)
const heroMedia = ref<HTMLElement | null>(null)
const fireMedia = ref<HTMLElement | null>(null)
let motionFrame = 0
let removeMotionListeners: (() => void) | undefined

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const savesData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const motionEnabled = !reduced && !savesData

  const updateMotion = () => {
    motionFrame = 0
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    progressBar.value?.style.setProperty('transform', `scaleX(${Math.min(1, window.scrollY / scrollMax)})`)
    if (!motionEnabled) return

    heroMedia.value?.style.setProperty('--hero-parallax', `${Math.max(-48, -window.scrollY * 0.055)}px`)
    if (fireMedia.value) {
      const rect = fireMedia.value.parentElement?.getBoundingClientRect()
      if (rect) {
        const distance = rect.top + rect.height / 2 - window.innerHeight / 2
        const offset = Math.max(-24, Math.min(24, distance * -0.035))
        fireMedia.value.style.setProperty('--fire-parallax', `${offset}px`)
      }
    }
  }
  const scheduleMotion = () => {
    if (!motionFrame) motionFrame = window.requestAnimationFrame(updateMotion)
  }

  window.addEventListener('scroll', scheduleMotion, { passive: true })
  window.addEventListener('resize', scheduleMotion, { passive: true })
  scheduleMotion()
  window.setTimeout(() => { heroReady.value = true }, 650)

  removeMotionListeners = () => {
    window.removeEventListener('scroll', scheduleMotion)
    window.removeEventListener('resize', scheduleMotion)
    if (motionFrame) window.cancelAnimationFrame(motionFrame)
  }
})

onBeforeUnmount(() => removeMotionListeners?.())

useSeoMeta({ title: '镇山村里的窑火与手作', description: '在贵阳花溪镇山村，等一炉面包慢慢出炉。发现窑烤菜单、手作DIY和村落打卡路线。' })
useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Bakery', name: '李老汉窑烤面包', address: { '@type': 'PostalAddress', addressLocality: '贵阳市花溪区', streetAddress: site.value?.address, addressCountry: 'CN' }, telephone: site.value?.phone || undefined }) }] })
</script>

<template>
  <div>
    <div ref="progressBar" class="motion-progress fixed inset-x-0 top-0 z-[70] h-[3px] bg-fire" aria-hidden="true" />
    <section class="relative isolate min-h-[82vh] overflow-hidden bg-ink text-white" :class="{ 'hero-is-ready': heroReady }">
      <div ref="heroMedia" class="hero-media absolute -inset-y-10 inset-x-0 -z-20">
        <ContentImage :image="blocks.hero.image || site?.heroImage" :alt="blocks.hero.image ? blocks.hero.imageAlt : site?.heroImageAlt" class="h-full w-full object-cover object-[55%_48%]" loading="eager" fetchpriority="high" @load="heroReady = true" />
      </div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
      <div class="hero-ember-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div class="page-wrap flex min-h-[82vh] items-end py-16 md:py-24">
        <div class="max-w-3xl"><p class="hero-copy-item text-xs font-semibold tracking-[0.24em] text-[#ff9b78]" style="--hero-delay: 80ms">{{ blocks.hero.eyebrow }}</p><h1 class="hero-copy-item mt-6 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.08] md:text-7xl lg:text-[5.6rem]" style="--hero-delay: 180ms">{{ blocks.hero.title || site?.heroTitle }}</h1><p class="hero-copy-item mt-7 max-w-xl whitespace-pre-line text-base leading-8 text-white/75 md:text-lg" style="--hero-delay: 310ms">{{ blocks.hero.description || site?.heroIntro }}</p><div class="hero-copy-item mt-9 flex flex-wrap gap-3" style="--hero-delay: 430ms"><NuxtLink v-if="blocks.hero.primaryButtonText" :to="blocks.hero.primaryButtonLink || '/menu'" class="btn-primary">{{ blocks.hero.primaryButtonText }}</NuxtLink><NuxtLink v-if="blocks.hero.secondaryButtonText" :to="blocks.hero.secondaryButtonLink || '/visit'" class="btn-secondary border-white/30 bg-white/10 text-white backdrop-blur">{{ blocks.hero.secondaryButtonText }}</NuxtLink></div></div>
      </div>
    </section>

    <section class="page-wrap py-20 md:py-32">
      <div class="grid items-center gap-12 md:grid-cols-2"><div v-reveal class="reveal-from-left relative"><div class="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><div ref="fireMedia" class="fire-parallax absolute -inset-y-8 inset-x-0"><ContentImage :image="blocks.fire.image || site?.homeFireImage" :alt="blocks.fire.image ? blocks.fire.imageAlt : site?.homeFireImageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="image-cover" /></div></div><span class="fire-badge absolute -bottom-5 -right-2 grid h-28 w-28 place-items-center rounded-full bg-fire px-4 text-center font-serif text-lg text-white md:right-8">一炉火<br>一整天</span></div><div v-reveal="120" class="reveal-from-right"><p class="eyebrow">{{ blocks.fire.eyebrow }}</p><h2 class="section-title mt-5 whitespace-pre-line">{{ blocks.fire.title }}</h2><p class="body-copy mt-7 whitespace-pre-line">{{ blocks.fire.description }}</p><NuxtLink v-if="blocks.fire.primaryButtonText" :to="blocks.fire.primaryButtonLink || '/story'" class="mt-8 inline-block border-b border-ink pb-1 font-semibold">{{ blocks.fire.primaryButtonText }}</NuxtLink></div></div>
    </section>

    <section class="bg-ink py-20 text-flour md:py-28">
      <div class="page-wrap">
        <div v-reveal class="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p class="eyebrow">{{ blocks.menu.eyebrow }}</p><h2 class="section-title mt-5 whitespace-pre-line">{{ blocks.menu.title }}</h2></div><NuxtLink v-if="blocks.menu.primaryButtonText" :to="blocks.menu.primaryButtonLink || '/menu'" class="text-sm font-semibold text-[#ff9b78]">{{ blocks.menu.primaryButtonText }}</NuxtLink></div>
        <div class="menu-motion-grid mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          <NuxtLink v-for="(item, index) in menuCategories" :key="`${item.title}-${index}`" v-reveal="index * 80" :to="item.buttonLink || '/menu'" class="menu-motion-card group overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#2c2521] text-flour hover:border-fire/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire sm:rounded-[1.75rem]">
            <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#44372f] via-[#332a25] to-[#241e1b]">
              <ContentImage v-if="item.image" :image="item.image" :alt="item.imageAlt || item.title" sizes="(min-width: 1024px) 33vw, 50vw" class="image-cover transition duration-500 group-hover:scale-[1.04]" />
              <div v-else class="absolute inset-0 flex items-end justify-between p-4 sm:p-6"><span class="font-serif text-5xl text-white/10 sm:text-7xl">{{ String(index + 1).padStart(2, '0') }}</span><span class="h-2.5 w-2.5 rounded-full bg-fire sm:h-3 sm:w-3" /></div>
            </div>
            <div class="p-4 sm:p-6"><p v-if="item.eyebrow" class="text-[11px] font-semibold tracking-[0.16em] text-[#ff9b78] sm:text-xs">{{ item.eyebrow }}</p><h3 class="mt-2 font-serif text-xl font-semibold sm:text-2xl">{{ item.title }}</h3><p v-if="item.text" class="mt-3 text-sm leading-6 text-flour/60 sm:text-base sm:leading-7">{{ item.text }}</p><span class="mt-4 inline-block text-xs font-semibold text-[#ff9b78] sm:text-sm">{{ item.buttonText || '查看菜单' }} →</span></div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="page-wrap py-20 md:py-32">
      <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div v-reveal class="reveal-from-left lg:sticky lg:top-28 lg:self-start"><p class="eyebrow">{{ blocks.diy.eyebrow }}</p><h2 class="section-title mt-5 whitespace-pre-line">{{ blocks.diy.title }}</h2><p class="body-copy mt-6 whitespace-pre-line">{{ blocks.diy.description }}</p><NuxtLink v-if="blocks.diy.primaryButtonText" :to="blocks.diy.primaryButtonLink || '/diy'" class="btn-primary mt-8">{{ blocks.diy.primaryButtonText }}</NuxtLink></div><div class="grid gap-6 md:grid-cols-2"><NuxtLink v-for="(item, index) in tutorialList" :key="item.id" v-reveal="100 + index * 110" :to="`/diy/${item.slug}`" class="paper-card group overflow-hidden"><div class="aspect-[4/5] overflow-hidden"><ContentImage :image="item.image" :alt="item.imageAlt" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw" class="image-cover transition duration-700 group-hover:scale-[1.05]" /></div><div class="p-6"><p class="eyebrow">{{ item.type }}</p><h3 class="mt-3 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-4 leading-7 text-charcoal">{{ item.summary }}</p></div></NuxtLink></div></div>
    </section>

    <section class="bg-lake py-20 text-white md:py-28">
      <div class="page-wrap"><div class="grid gap-8 md:grid-cols-[1fr_1.2fr]"><div v-reveal class="reveal-from-left"><p class="text-xs font-semibold tracking-[0.2em] text-white/60">{{ blocks.guide.eyebrow }}</p><h2 class="section-title mt-5 whitespace-pre-line">{{ blocks.guide.title }}</h2><p class="mt-6 max-w-lg whitespace-pre-line leading-8 text-white/70">{{ blocks.guide.description }}</p><NuxtLink v-if="blocks.guide.primaryButtonText" :to="blocks.guide.primaryButtonLink || '/guide'" class="mt-8 inline-block border-b border-white pb-1 font-semibold">{{ blocks.guide.primaryButtonText }}</NuxtLink></div><div class="grid gap-4 sm:grid-cols-3"><article v-for="(spot, index) in spotList" :key="spot.id" v-reveal="120 + index * 100" class="overflow-hidden rounded-[1.5rem] bg-white/10"><div class="aspect-square overflow-hidden"><ContentImage :image="spot.image" :alt="spot.imageAlt" sizes="(min-width: 768px) 20vw, 33vw" class="image-cover transition duration-700 hover:scale-[1.04]" /></div><div class="p-5"><span class="text-xs text-white/55">0{{ index + 1 }}</span><h3 class="mt-2 font-serif text-xl">{{ spot.name }}</h3></div></article></div></div></div>
    </section>

    <ContactPanel />
  </div>
</template>
