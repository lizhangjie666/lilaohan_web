<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'
import { createDemoResources, withDemoResourceImage, withDemoStepImage } from '~/data/diy-demo-images'
import type { PageSectionItem } from '~/types/content'

const { tutorials, settings, diySettings, pageSections, spots } = useContent()
const [{ data: list }, { data: site }, { data: diy }, { data: sectionList }, { data: spotList }] = await Promise.all([
  useAsyncData('tutorials', tutorials),
  useAsyncData('diy-site-settings', settings),
  useAsyncData('diy-promotion-settings', diySettings),
  useAsyncData('diy-sections', () => pageSections('diy')),
  useAsyncData('diy-village-spots', spots),
])
const sectionKeys = ['diy.hero', 'diy.value', 'diy.ready', 'diy.process', 'diy.ingredients', 'diy.tools', 'diy.philosophy', 'diy.story', 'diy.village', 'diy.works', 'diy.booking', 'diy.other', 'diy.empty']
const blocks = computed(() => mergePageSections(sectionList.value, sectionKeys))
const featured = computed(() => {
  const entries = list.value || []
  return entries.find(item => item.slug === diy.value?.featuredTutorialSlug) || entries.find(item => item.slug === 'bread-diy') || entries[0]
})
const otherTutorials = computed(() => (list.value || []).filter(item => item.id !== featured.value?.id))
const featuredSteps = computed(() => (featured.value?.steps || []).map(withDemoStepImage))
const featuredIngredients = computed(() => {
  const items = featured.value?.ingredients || []
  return items.length ? items.map(withDemoResourceImage) : createDemoResources(['肉松', '蔓越莓干', '葡萄干', '巧克力豆'])
})
const featuredTools = computed(() => {
  const items = featured.value?.tools || []
  return items.length ? items.map(withDemoResourceImage) : createDemoResources(['擀面杖', '切面刀'])
})
const heroImage = computed(() => blocks.value.hero.image || featured.value?.image || site.value?.diyHeroImage)
const heroAlt = computed(() => blocks.value.hero.image ? blocks.value.hero.imageAlt : featured.value?.image ? featured.value.imageAlt : site.value?.diyHeroImageAlt)
const villageItems = computed<PageSectionItem[]>(() => {
  if (blocks.value.village.items.some(item => item.image)) return blocks.value.village.items
  return (spotList.value || []).slice(0, 6).map(item => ({ title: item.name, text: item.summary, image: item.image, imageAlt: item.imageAlt }))
})
const priceUnit = computed(() => diy.value?.priceUnit || '元 / 人')
const { handleBooking } = useBooking()

useSeoMeta({
  title: () => diy.value?.seoTitle || '李老汉窑烤面包DIY体验｜贵阳花溪镇山村',
  description: () => diy.value?.seoDescription || '贵阳市花溪区镇山村窑烤面包DIY体验，78元/人，每人一份面团，可创意造型3–6个面包，适合亲子周末出游。',
})
</script>

<template>
  <div class="diy-page bg-[#fff8e9] pb-24 text-[#37271f] md:pb-0">
    <section class="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-ink text-white">
      <ContentImage v-if="heroImage" :image="heroImage" :alt="heroAlt" sizes="100vw" loading="eager" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover opacity-70 motion-safe:animate-[diyHero_16s_ease-out_both]" />
      <div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(229,83,24,.38),transparent_32%),linear-gradient(135deg,#3c2419,#152a20)]" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
      <div class="page-wrap relative flex min-h-[calc(100svh-4.5rem)] items-end py-14 md:items-center md:py-24">
        <div class="max-w-3xl" v-reveal>
          <p class="eyebrow text-[#ffc29f]">{{ blocks.hero.eyebrow }}</p>
          <h1 class="mt-5 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">{{ blocks.hero.title }}</h1>
          <p class="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-white/80 md:text-lg">{{ blocks.hero.description }}</p>
          <div class="mt-7 flex flex-wrap items-end gap-5">
            <div><strong class="font-serif text-6xl text-[#ff7a42] md:text-7xl">{{ diy?.price ?? 78 }}</strong><span class="ml-2 text-base font-semibold">{{ priceUnit }}</span></div>
            <div class="border-l border-white/25 pl-5 text-sm leading-7 text-white/75"><p>{{ diy?.doughPerPerson }}</p><p>{{ diy?.breadsPerPerson }}</p></div>
          </div>
          <p v-if="site?.address" class="mt-5 flex items-start gap-2 text-sm text-white/70"><span aria-hidden="true">●</span><span>{{ site.address }}</span></p>
          <div class="mt-8 flex flex-wrap gap-3">
            <button type="button" class="rounded-full bg-fire px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#f06730] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" @click="handleBooking">{{ blocks.hero.primaryButtonText || '立即预约' }}</button>
            <a href="#diy-process" class="rounded-full border border-white/40 px-7 py-4 font-semibold transition hover:bg-white hover:text-ink">{{ blocks.hero.secondaryButtonText || '看看怎么玩' }}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="page-wrap py-16 md:py-24">
      <div class="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
        <div v-reveal class="motion-reveal"><p class="eyebrow text-fire">{{ blocks.value.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl"><span class="text-fire">¥{{ diy?.price ?? 78 }}</span><br>{{ blocks.value.title }}</h2><p class="mt-5 text-lg leading-8 text-charcoal">{{ blocks.value.description }}</p></div>
        <div class="grid gap-3 sm:grid-cols-3">
          <article v-for="(item, index) in blocks.value.items" :key="item.title" v-reveal="index * 80" class="motion-reveal rounded-[1.75rem] border border-ink/10 bg-white p-6"><span class="font-serif text-4xl text-fire/35">0{{ index + 1 }}</span><h3 class="mt-8 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.text }}</p></article>
        </div>
      </div>
      <div v-if="diy?.bookingGift" class="mt-8 rounded-2xl border border-dashed border-fire/40 bg-[#fff0df] px-5 py-4 text-center font-semibold text-fire">预约提示：{{ diy.bookingGift }}</div>
    </section>

    <section class="bg-[#244c35] py-16 text-white md:py-24">
      <div class="page-wrap grid gap-8 lg:grid-cols-2 lg:items-center">
        <div v-reveal class="motion-reveal overflow-hidden rounded-[2.25rem] bg-[#d7bd8d]"><ContentImage v-if="blocks.ready.image" :image="blocks.ready.image" :alt="blocks.ready.imageAlt" sizes="(min-width:1024px) 50vw, 100vw" class="aspect-[4/3] h-full w-full object-cover" /><div v-else class="grid aspect-[4/3] place-items-center bg-[radial-gradient(circle_at_70%_25%,rgba(229,83,24,.35),transparent_28%),linear-gradient(145deg,#dec397,#856b48)]"><span class="text-xs tracking-[.18em] text-white/75">准备过程照片待上传</span></div></div>
        <div v-reveal="100" class="motion-reveal lg:pl-10"><p class="eyebrow text-[#f4b08b]">{{ blocks.ready.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.ready.title }}</h2><p class="mt-5 whitespace-pre-line text-lg leading-9 text-white/75">{{ blocks.ready.description }}</p><div class="mt-8 grid gap-4 sm:grid-cols-2"><div v-for="item in blocks.ready.items" :key="item.title" class="rounded-2xl border border-white/15 p-5"><h3 class="font-serif text-xl font-semibold">{{ item.title }}</h3><p class="mt-2 text-sm leading-6 text-white/65">{{ item.text }}</p></div></div></div>
      </div>
    </section>

    <section id="diy-process" class="page-wrap scroll-mt-24 py-16 md:py-24">
      <div v-reveal class="motion-reveal max-w-4xl"><p class="eyebrow text-fire">{{ blocks.process.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.process.title }}</h2><p class="mt-5 text-lg leading-8 text-charcoal">{{ blocks.process.description }}</p></div>
      <DiyTimeline v-if="featuredSteps.length" :steps="featuredSteps" class="mt-10 md:mt-14" />
      <div v-else class="mt-10 rounded-3xl border border-ink/10 bg-white p-8 text-center">体验流程正在后台整理中。</div>
    </section>

    <section class="border-y border-ink/10 bg-[#f2e2c5] py-16 md:py-24">
      <div class="page-wrap grid gap-14 lg:grid-cols-2">
        <div><p class="eyebrow text-fire">{{ blocks.ingredients.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold">{{ blocks.ingredients.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ blocks.ingredients.description }}</p><DiyResourceGrid :items="featuredIngredients" class="mt-8" /></div>
        <div><p class="eyebrow text-[#28764a]">{{ blocks.tools.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold">{{ blocks.tools.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ blocks.tools.description }}</p><DiyResourceGrid :items="featuredTools" class="mt-8" /></div>
      </div>
    </section>

    <section class="page-wrap py-16 md:py-24"><div v-reveal class="motion-reveal relative overflow-hidden rounded-[2.5rem] bg-[#e55318] px-7 py-14 text-white md:px-16 md:py-20"><div class="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[3rem] border-white/10" aria-hidden="true" /><p class="eyebrow text-white/70">{{ blocks.philosophy.eyebrow }}</p><h2 class="relative mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.philosophy.title }}</h2><p class="relative mt-6 max-w-3xl text-lg leading-9 text-white/80">{{ blocks.philosophy.description }}</p></div></section>

    <section class="page-wrap pb-20 md:pb-28"><div v-reveal class="motion-reveal text-center"><p class="eyebrow text-fire">{{ blocks.story.eyebrow }}</p><h2 class="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.story.title }}</h2></div><div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><article v-for="(item, index) in blocks.story.items" :key="item.title" v-reveal="index * 80" class="motion-reveal rounded-[2rem] border border-ink/10 bg-white p-7 lg:even:translate-y-8"><span class="text-xs font-bold tracking-[.18em] text-fire">{{ item.eyebrow || `0${index + 1}` }}</span><h3 class="mt-8 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.text }}</p></article></div></section>

    <section class="bg-[#193b2a] py-16 text-white md:py-24"><div class="page-wrap"><div class="max-w-3xl"><p class="eyebrow text-[#f1a17b]">{{ blocks.village.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.village.title }}</h2><p class="mt-5 text-lg leading-8 text-white/70">{{ blocks.village.description }}</p></div><DiyGallery v-if="villageItems.length" :items="villageItems" fallback-title="镇山村实拍待上传" class="mt-10" /><div v-else class="mt-10 rounded-3xl border border-white/15 p-10 text-center text-white/65">镇山村环境照片待后台上传。</div></div></section>

    <section class="page-wrap py-16 md:py-24"><div class="text-center"><p class="eyebrow text-fire">{{ blocks.works.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">{{ blocks.works.title }}</h2><p class="mt-5 text-charcoal">{{ blocks.works.description }}</p></div><DiyGallery :items="blocks.works.items" fallback-title="顾客作品照片待上传" class="mt-10" /></section>

    <section class="page-wrap pb-16 md:pb-24"><div class="rounded-[2.5rem] bg-ink px-7 py-14 text-center text-white md:px-14 md:py-20"><p class="eyebrow text-[#f1a17b]">{{ blocks.booking.eyebrow }}</p><h2 class="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.booking.title }}</h2><p class="mx-auto mt-5 max-w-2xl leading-8 text-white/65">{{ blocks.booking.description }}</p><div class="mt-8 flex flex-wrap justify-center gap-3"><button type="button" class="rounded-full bg-fire px-7 py-4 font-semibold" @click="handleBooking">{{ blocks.booking.primaryButtonText || '立即预约' }}</button><NuxtLink :to="blocks.booking.secondaryButtonLink || '/visit'" class="rounded-full border border-white/30 px-7 py-4 font-semibold">{{ blocks.booking.secondaryButtonText || '查看到店指南' }}</NuxtLink></div></div></section>

    <section v-if="otherTutorials.length" class="page-wrap pb-20 md:pb-28"><p class="eyebrow text-fire">{{ blocks.other.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold">{{ blocks.other.title }}</h2><div class="mt-8 grid gap-6 md:grid-cols-2"><NuxtLink v-for="item in otherTutorials" :key="item.id" :to="`/diy/${item.slug}`" class="group overflow-hidden rounded-[2rem] border border-ink/10 bg-white"><div class="aspect-[16/9] overflow-hidden"><ContentImage v-if="item.image" :image="item.image" :alt="item.imageAlt" sizes="(min-width:768px) 50vw, 100vw" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><div v-else class="grid h-full place-items-center bg-[#ead9b8] text-sm text-charcoal">体验照片待上传</div></div><div class="p-7"><p class="eyebrow text-fire">{{ item.type }}</p><h3 class="mt-3 font-serif text-3xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.summary }}</p><span class="mt-5 inline-block font-semibold text-fire">查看体验 →</span></div></NuxtLink></div></section>

    <DiyBookingModal :site="site" />
    <DiyMobileBookingBar :price="diy?.price ?? 78" :price-unit="priceUnit" />
  </div>
</template>

<style scoped>
@keyframes diyHero{from{transform:scale(1.04)}to{transform:scale(1.1)}}
@media (prefers-reduced-motion:reduce){.diy-page *{scroll-behavior:auto!important;animation:none!important}}
</style>
