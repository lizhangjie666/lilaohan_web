<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'
import type { PageSectionItem } from '~/types/content'

const route = useRoute()
const { tutorials, settings, diySettings, pageSections, spots } = useContent()
const [{ data: list }, { data: site }, { data: diy }, { data: sectionList }, { data: spotList }] = await Promise.all([
  useAsyncData(`diy-project-${String(route.params.slug)}`, tutorials),
  useAsyncData('diy-project-settings', settings),
  useAsyncData('diy-project-promotion-settings', diySettings),
  useAsyncData('diy-project-sections', () => pageSections('diy')),
  useAsyncData('diy-project-village-spots', spots),
])
const sectionKeys = ['diy.hero', 'diy.value', 'diy.ready', 'diy.process', 'diy.ingredients', 'diy.tools', 'diy.philosophy', 'diy.story', 'diy.village', 'diy.works', 'diy.booking']
const blocks = computed(() => mergePageSections(sectionList.value, sectionKeys))
const tutorial = computed(() => list.value?.find(item => item.slug === route.params.slug))
if (!tutorial.value) throw createError({ statusCode: 404, statusMessage: '没有找到这个体验项目' })

const isFeatured = computed(() => tutorial.value?.slug === (diy.value?.featuredTutorialSlug || 'bread-diy'))
const isPreparing = computed(() => tutorial.value?.experienceStatus === '内容筹备中')
const hasTutorial = computed(() => !isPreparing.value && (tutorial.value?.steps.length || 0) > 0)
const projectSteps = computed(() => {
  return tutorial.value?.steps || []
})
const projectIngredients = computed(() => {
  return tutorial.value?.ingredients || []
})
const projectTools = computed(() => {
  return tutorial.value?.tools || []
})
const heroImage = computed(() => tutorial.value?.image || (isFeatured.value ? (blocks.value.hero.image || site.value?.diyHeroImage) : undefined))
const heroAlt = computed(() => tutorial.value?.image ? tutorial.value.imageAlt : blocks.value.hero.image ? blocks.value.hero.imageAlt : site.value?.diyHeroImageAlt)
const villageItems = computed<PageSectionItem[]>(() => {
  if (blocks.value.village.items.some(item => item.image)) return blocks.value.village.items
  return (spotList.value || []).slice(0, 6).map(item => ({ title: item.name, text: item.summary, image: item.image, imageAlt: item.imageAlt }))
})
const { handleBooking } = useBooking()

useSeoMeta({
  title: () => `${tutorial.value?.title || '手作体验'}｜李老汉窑烤面包`,
  description: () => tutorial.value?.summary || '了解镇山村窑烤手作体验的内容、流程和注意事项。',
})
</script>

<template>
  <div v-if="tutorial" class="bg-[#fff8e9] pb-24 text-[#37271f] md:pb-0">
    <section class="relative isolate min-h-[70svh] overflow-hidden bg-ink text-white">
      <ContentImage v-if="heroImage" :image="heroImage" :alt="heroAlt" sizes="100vw" loading="eager" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover opacity-65" />
      <div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(229,83,24,.38),transparent_32%),linear-gradient(135deg,#3c2419,#152a20)]" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/15" />
      <div class="page-wrap relative flex min-h-[70svh] items-end py-14 md:items-center md:py-24">
        <div class="max-w-3xl" v-reveal>
          <NuxtLink to="/diy" class="text-sm font-semibold text-[#ffc29f]">← 返回全部体验</NuxtLink>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <p class="eyebrow text-[#ffc29f]">{{ tutorial.type }}</p>
            <span v-if="isPreparing" class="rounded-full border border-[#ffc29f]/40 bg-ink/40 px-3 py-1 text-xs font-semibold text-[#ffc29f]">内容筹备中</span>
          </div>
          <h1 class="mt-5 font-serif text-5xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">{{ tutorial.title }}</h1>
          <p class="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{{ tutorial.summary }}</p>
          <div v-if="tutorial.duration || tutorial.people" class="mt-6 flex flex-wrap gap-3"><span v-if="tutorial.duration" class="rounded-full border border-white/25 px-4 py-2 text-sm">{{ tutorial.duration }}</span><span v-if="tutorial.people" class="rounded-full border border-white/25 px-4 py-2 text-sm">{{ tutorial.people }}</span></div>
          <div class="mt-8 flex flex-wrap gap-3"><button type="button" class="btn-primary" @click="handleBooking">添加微信咨询</button><NuxtLink v-if="hasTutorial" :to="`/diy/${tutorial.slug}/tutorial`" class="rounded-full border border-white/40 px-7 py-4 font-semibold transition hover:bg-white hover:text-ink">查看完整教程</NuxtLink></div>
        </div>
      </div>
    </section>

    <section v-if="isPreparing" class="page-wrap py-16 md:py-24">
      <div class="mx-auto max-w-4xl rounded-[2.5rem] border border-fire/20 bg-white px-7 py-12 text-center shadow-sm md:px-14 md:py-16" v-reveal>
        <p class="eyebrow text-fire">COMING SOON</p>
        <h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">项目内容正在筹备中</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-9 text-charcoal">{{ tutorial.summary || '具体开放时间与体验安排将在确认后发布，欢迎添加门店微信咨询。' }}</p>
        <button type="button" class="btn-primary mt-8" @click="handleBooking">添加微信咨询</button>
      </div>
    </section>

    <section v-if="isFeatured && !isPreparing" class="page-wrap py-16 md:py-24">
      <div class="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
        <div v-reveal><p class="eyebrow text-fire">{{ blocks.value.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.value.title }}</h2><p class="mt-5 text-lg leading-8 text-charcoal">{{ blocks.value.description }}</p><div class="mt-5 text-sm leading-7 text-charcoal"><p v-if="diy?.doughPerPerson">{{ diy.doughPerPerson }}</p><p v-if="diy?.breadsPerPerson">{{ diy.breadsPerPerson }}</p></div></div>
        <div class="grid gap-3 sm:grid-cols-3"><article v-for="(item, index) in blocks.value.items" :key="item.title" v-reveal="index * 80" class="rounded-[1.75rem] border border-ink/10 bg-white p-6"><span class="font-serif text-4xl text-fire/35">0{{ index + 1 }}</span><h3 class="mt-8 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.text }}</p></article></div>
      </div>
      <div v-if="diy?.bookingGift" class="mt-8 rounded-2xl border border-dashed border-fire/40 bg-[#fff0df] px-5 py-4 text-center font-semibold text-fire">预约提示：{{ diy.bookingGift }}</div>
    </section>

    <section v-if="isFeatured && !isPreparing" class="bg-[#244c35] py-16 text-white md:py-24"><div class="page-wrap grid gap-8 lg:grid-cols-2 lg:items-center"><div v-reveal class="overflow-hidden rounded-[2.25rem] bg-[#d7bd8d]"><ContentImage v-if="blocks.ready.image" :image="blocks.ready.image" :alt="blocks.ready.imageAlt" sizes="(min-width:1024px) 50vw, 100vw" class="aspect-[4/3] h-full w-full object-cover" /><div v-else class="grid aspect-[4/3] place-items-center bg-[linear-gradient(145deg,#dec397,#856b48)] text-sm text-white/75">准备过程照片待上传</div></div><div v-reveal="100" class="lg:pl-10"><p class="eyebrow text-[#f4b08b]">{{ blocks.ready.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.ready.title }}</h2><p class="mt-5 whitespace-pre-line text-lg leading-9 text-white/75">{{ blocks.ready.description }}</p><div class="mt-8 grid gap-4 sm:grid-cols-2"><div v-for="item in blocks.ready.items" :key="item.title" class="rounded-2xl border border-white/15 p-5"><h3 class="font-serif text-xl font-semibold">{{ item.title }}</h3><p class="mt-2 text-sm leading-6 text-white/65">{{ item.text }}</p></div></div></div></div></section>

    <section v-if="!isPreparing" id="diy-process" class="page-wrap scroll-mt-24 py-16 md:py-24">
      <div v-reveal class="max-w-4xl"><p class="eyebrow text-fire">{{ blocks.process.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ isFeatured ? blocks.process.title : `${tutorial.title}体验流程` }}</h2><p v-if="blocks.process.description" class="mt-5 text-lg leading-8 text-charcoal">{{ blocks.process.description }}</p></div>
      <DiyTimeline v-if="projectSteps.length" :steps="projectSteps" class="mt-10 md:mt-14" />
      <div v-else class="mt-10 rounded-3xl border border-ink/10 bg-white p-8 text-center">体验流程正在后台整理中。</div>
      <div v-if="hasTutorial" class="mt-8 text-right"><NuxtLink :to="`/diy/${tutorial.slug}/tutorial`" class="btn-primary">查看完整教程</NuxtLink></div>
    </section>

    <section v-if="!isPreparing && (projectIngredients.length || projectTools.length)" class="border-y border-ink/10 bg-[#f2e2c5] py-16 md:py-24"><div class="page-wrap grid gap-14 lg:grid-cols-2"><div v-if="projectIngredients.length"><p class="eyebrow text-fire">{{ blocks.ingredients.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold">{{ blocks.ingredients.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ blocks.ingredients.description }}</p><DiyResourceGrid :items="projectIngredients" class="mt-8" /></div><div v-if="projectTools.length"><p class="eyebrow text-[#28764a]">{{ blocks.tools.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold">{{ blocks.tools.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ blocks.tools.description }}</p><DiyResourceGrid :items="projectTools" class="mt-8" /></div></div></section>

    <template v-if="isFeatured && !isPreparing">
      <section class="page-wrap py-16 md:py-24"><div v-reveal class="relative overflow-hidden rounded-[2.5rem] bg-[#e55318] px-7 py-14 text-white md:px-16 md:py-20"><p class="eyebrow text-white/70">{{ blocks.philosophy.eyebrow }}</p><h2 class="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.philosophy.title }}</h2><p class="mt-6 max-w-3xl text-lg leading-9 text-white/80">{{ blocks.philosophy.description }}</p></div></section>
      <section class="page-wrap pb-20 md:pb-28"><div class="text-center"><p class="eyebrow text-fire">{{ blocks.story.eyebrow }}</p><h2 class="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.story.title }}</h2></div><div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><article v-for="(item, index) in blocks.story.items" :key="item.title" class="rounded-[2rem] border border-ink/10 bg-white p-7"><span class="text-xs font-bold tracking-[.18em] text-fire">{{ item.eyebrow || `0${index + 1}` }}</span><h3 class="mt-8 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.text }}</p></article></div></section>
      <section class="bg-[#193b2a] py-16 text-white md:py-24"><div class="page-wrap"><div class="max-w-3xl"><p class="eyebrow text-[#f1a17b]">{{ blocks.village.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ blocks.village.title }}</h2><p class="mt-5 text-lg leading-8 text-white/70">{{ blocks.village.description }}</p></div><DiyGallery v-if="villageItems.length" :items="villageItems" fallback-title="镇山村实拍待上传" class="mt-10" /></div></section>
      <section class="page-wrap py-16 md:py-24"><div class="text-center"><p class="eyebrow text-fire">{{ blocks.works.eyebrow }}</p><h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">{{ blocks.works.title }}</h2><p class="mt-5 text-charcoal">{{ blocks.works.description }}</p></div><DiyGallery :items="blocks.works.items" fallback-title="顾客作品照片待上传" class="mt-10" /></section>
    </template>

    <section v-if="!isPreparing && tutorial.notes.length" class="page-wrap pb-16"><div class="rounded-[2rem] bg-white p-7 md:p-10"><h2 class="font-serif text-3xl font-semibold">体验前请留意</h2><ul class="mt-5 grid gap-3 text-charcoal"><li v-for="note in tutorial.notes" :key="note">· {{ note }}</li></ul></div></section>
    <section class="page-wrap pb-16 md:pb-24"><div class="rounded-[2.5rem] bg-ink px-7 py-14 text-center text-white md:px-14 md:py-20"><p class="eyebrow text-[#f1a17b]">{{ blocks.booking.eyebrow }}</p><h2 class="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ isPreparing ? `咨询${tutorial.title}` : (isFeatured ? blocks.booking.title : `预约${tutorial.title}`) }}</h2><p class="mx-auto mt-5 max-w-2xl leading-8 text-white/65">{{ tutorial.consultationTip || blocks.booking.description }}</p><div class="mt-8 flex flex-wrap justify-center gap-3"><button type="button" class="rounded-full bg-fire px-7 py-4 font-semibold" @click="handleBooking">添加微信{{ isPreparing ? '咨询' : '预约' }}</button><NuxtLink v-if="hasTutorial" :to="`/diy/${tutorial.slug}/tutorial`" class="rounded-full border border-white/30 px-7 py-4 font-semibold">查看教程</NuxtLink></div></div></section>

    <DiyBookingModal :site="site" :experience-name="tutorial.title" />
    <DiyMobileBookingBar />
  </div>
</template>
