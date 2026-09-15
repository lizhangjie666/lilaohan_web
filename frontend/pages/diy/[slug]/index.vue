<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const route = useRoute()
const { tutorials, settings, diySettings, pageSections } = useContent()
const [{ data: list }, { data: site }, { data: diy }, { data: sectionList }] = await Promise.all([
  useAsyncData(`diy-project-${String(route.params.slug)}`, tutorials), useAsyncData('diy-project-settings', settings),
  useAsyncData('diy-project-promotion-settings', diySettings), useAsyncData('diy-project-sections', () => pageSections('diy')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy.ready', 'diy.process', 'diy.booking']))
const tutorial = computed(() => list.value?.find(item => item.slug === route.params.slug))
if (!tutorial.value) throw createError({ statusCode: 404, statusMessage: '没有找到这个体验项目' })
const isBreadDiy = computed(() => tutorial.value?.slug === 'bread-diy')
const isPreparing = computed(() => tutorial.value?.experienceStatus === '内容筹备中')
const hasTutorial = computed(() => !isPreparing.value && ((tutorial.value?.steps.length || 0) > 0 || (tutorial.value?.tutorialChapters.length || 0) > 0))
const heroImage = computed(() => tutorial.value?.image || (isBreadDiy.value ? site.value?.diyHeroImage : undefined))
const heroAlt = computed(() => tutorial.value?.image ? tutorial.value.imageAlt : site.value?.diyHeroImageAlt)
const compactPrice = computed(() => tutorial.value?.detailPrice == null ? '' : `${tutorial.value.detailPrice}${(tutorial.value.detailPriceUnit || '元 / 人').replace(/\s/g, '')}`)
const { handleBooking } = useBooking()
useSeoMeta({
  title: () => isBreadDiy.value ? `窑烤面包DIY体验｜${compactPrice.value || '78元/人'}｜贵阳花溪镇山村` : compactPrice.value ? `${tutorial.value?.title || '手作体验'}｜${compactPrice.value}｜贵阳花溪镇山村` : `${tutorial.value?.title || '手作体验'}｜李老汉窑烤面包`,
  description: () => isBreadDiy.value ? `贵阳花溪镇山村窑烤面包DIY体验，${compactPrice.value || '78元/人'}，每人一份面团，可自由制作3–6个面包，提供配料与工具。` : compactPrice.value ? `${tutorial.value?.summary || ''} 体验价格${compactPrice.value}，具体安排请添加门店微信咨询。` : tutorial.value?.summary,
})
</script>

<template>
  <div v-if="tutorial" class="bg-[#fff8e9] pb-24 text-[#37271f] md:pb-0">
    <section class="relative isolate min-h-[70svh] overflow-hidden bg-ink text-white">
      <ContentImage v-if="heroImage" :image="heroImage" :alt="heroAlt" sizes="100vw" loading="eager" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover opacity-65" />
      <div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(229,83,24,.38),transparent_32%),linear-gradient(135deg,#3c2419,#152a20)]" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/15" />
      <div class="page-wrap relative flex min-h-[70svh] items-end py-14 md:items-center md:py-24"><div class="max-w-3xl" v-reveal>
        <NuxtLink to="/diy" class="text-sm font-semibold text-[#ffc29f]">← 返回全部体验</NuxtLink>
        <div class="mt-8 flex flex-wrap items-center gap-3"><p class="eyebrow text-[#ffc29f]">{{ tutorial.type }}</p><span v-if="isPreparing" class="rounded-full border border-[#ffc29f]/40 bg-ink/40 px-3 py-1 text-xs font-semibold text-[#ffc29f]">内容筹备中</span></div>
        <h1 class="mt-5 font-serif text-5xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">{{ tutorial.title }}</h1><p class="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{{ tutorial.summary }}</p>
        <div v-if="tutorial.detailPrice != null" class="mt-7 flex items-end gap-3 text-[#ff8b5f]"><strong class="font-serif text-7xl leading-none">{{ tutorial.detailPrice }}</strong><span class="pb-2 text-lg font-semibold">{{ tutorial.detailPriceUnit || '元 / 人' }}</span></div>
        <div v-if="tutorial.duration || tutorial.people" class="mt-6 flex flex-wrap gap-3"><span v-if="tutorial.duration" class="rounded-full border border-white/25 px-4 py-2 text-sm">{{ tutorial.duration }}</span><span v-if="tutorial.people" class="rounded-full border border-white/25 px-4 py-2 text-sm">{{ tutorial.people }}</span></div>
        <div class="mt-8 flex flex-wrap gap-3"><button type="button" class="btn-primary" @click="handleBooking">添加微信{{ isPreparing ? '咨询' : '预约' }}</button><NuxtLink v-if="hasTutorial" :to="`/diy/${tutorial.slug}/tutorial`" class="rounded-full border border-white/40 px-7 py-4 font-semibold transition hover:bg-white hover:text-ink">查看完整教程</NuxtLink></div>
      </div></div>
    </section>

    <section v-if="isPreparing" class="page-wrap py-16 md:py-24"><div class="mx-auto max-w-4xl rounded-[2.5rem] border border-fire/20 bg-white px-7 py-12 text-center shadow-sm md:px-14 md:py-16" v-reveal><p class="eyebrow text-fire">COMING SOON</p><h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">项目内容正在筹备中</h2><p class="mx-auto mt-6 max-w-2xl text-lg leading-9 text-charcoal">{{ tutorial.summary }}</p><button type="button" class="btn-primary mt-8" @click="handleBooking">添加微信咨询</button></div></section>

    <section v-if="isBreadDiy && !isPreparing" class="page-wrap py-16 md:py-24"><div class="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
      <div v-reveal><p class="eyebrow text-fire">WHAT YOU GET</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">一块面团，一次自由创作。</h2><p class="mt-5 text-lg leading-8 text-charcoal">自己做的面包，就是最好吃的。</p><div class="mt-6 grid gap-2 text-charcoal"><p>{{ diy?.doughPerPerson }}</p><p>{{ diy?.breadsPerPerson }}</p></div></div>
      <div class="grid gap-3 sm:grid-cols-3"><article v-for="(item, index) in [{ title: '一份面团', text: '每位体验者都有一份属于自己的面团。' }, { title: '自由造型', text: '不限制固定造型，把想象变成3–6个面包。' }, { title: '配料与工具', text: '基础配料与制作工具由门店准备。' }]" :key="item.title" class="rounded-[1.75rem] border border-ink/10 bg-white p-6"><span class="font-serif text-4xl text-fire/35">0{{ index + 1 }}</span><h3 class="mt-8 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ item.text }}</p></article></div>
    </div><div v-if="diy?.bookingGift" class="mt-8 rounded-2xl border border-dashed border-fire/40 bg-[#fff0df] px-5 py-4 text-center font-semibold text-fire">预约提示：{{ diy.bookingGift }}</div></section>

    <section v-if="isBreadDiy && !isPreparing" class="bg-[#244c35] py-16 text-white md:py-24"><div class="page-wrap grid gap-8 lg:grid-cols-2 lg:items-center"><div v-reveal class="overflow-hidden rounded-[2.25rem] bg-[#d7bd8d]"><ContentImage v-if="blocks.ready.image" :image="blocks.ready.image" :alt="blocks.ready.imageAlt" sizes="(min-width:1024px) 50vw, 100vw" class="aspect-[4/3] h-full w-full object-cover" /><div v-else class="grid aspect-[4/3] place-items-center bg-[linear-gradient(145deg,#dec397,#856b48)] text-sm text-white/75">准备过程照片待上传</div></div><div v-reveal="100" class="lg:pl-10"><p class="eyebrow text-[#f4b08b]">READY TO CREATE</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">把时间留给创造。</h2><p class="mt-5 text-lg leading-9 text-white/75">我们提前完成和面与第一次发酵，小朋友拿到面团后，就可以直接开始自由创作。</p><div class="mt-8 grid gap-4 sm:grid-cols-2"><div class="rounded-2xl border border-white/15 p-5"><h3 class="font-serif text-xl font-semibold">提前和面</h3></div><div class="rounded-2xl border border-white/15 p-5"><h3 class="font-serif text-xl font-semibold">完成第一次发酵</h3></div></div></div></div></section>

    <section v-if="!isPreparing" id="diy-process" class="page-wrap scroll-mt-24 py-16 md:py-24"><div v-reveal class="max-w-4xl"><p class="eyebrow text-fire">DIY PROCESS</p><h2 class="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ isBreadDiy ? '从一块面团，到香喷喷地带回家。' : `${tutorial.title}流程` }}</h2></div><DiyTimeline v-if="tutorial.steps.length" :steps="tutorial.steps" class="mt-10 md:mt-14" /><div v-else class="mt-10 rounded-3xl border border-ink/10 bg-white p-8 text-center">体验流程正在后台整理中。</div><div v-if="hasTutorial" class="mt-8 text-right"><NuxtLink :to="`/diy/${tutorial.slug}/tutorial`" class="btn-primary">查看完整教程</NuxtLink></div></section>

    <section v-if="!isPreparing && (tutorial.ingredients.length || tutorial.tools.length)" class="border-y border-ink/10 bg-[#f2e2c5] py-16 md:py-24"><div class="page-wrap grid gap-14 lg:grid-cols-2"><div v-if="tutorial.ingredients.length"><p class="eyebrow text-fire">INGREDIENTS</p><h2 class="mt-4 font-serif text-4xl font-semibold">提供配料</h2><p class="mt-4 leading-8 text-charcoal">肉松、蔓越莓干、葡萄干和巧克力豆，以门店当天准备为准。</p><DiyResourceGrid :items="tutorial.ingredients" class="mt-8" /></div><div v-if="tutorial.tools.length"><p class="eyebrow text-[#28764a]">TOOLS</p><h2 class="mt-4 font-serif text-4xl font-semibold">工具不用带，我们已经准备好了。</h2><DiyResourceGrid :items="tutorial.tools" class="mt-8" /></div></div></section>

    <section v-if="isBreadDiy && !isPreparing" class="page-wrap py-16 md:py-24"><div v-reveal class="overflow-hidden rounded-[2.5rem] bg-[#e55318] px-7 py-14 text-white md:px-16 md:py-20"><p class="eyebrow text-white/70">OUR IDEA</p><h2 class="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">自由 DIY，做出自己喜欢的造型。</h2><p class="mt-6 max-w-3xl text-lg leading-9 text-white/80">不限制固定造型，不过多干预创作。让孩子自己动手、自由发挥，做出真正属于自己的面包。</p></div></section>
    <section v-if="!isPreparing && tutorial.notes.length" class="page-wrap pb-16"><div class="rounded-[2rem] bg-white p-7 md:p-10"><h2 class="font-serif text-3xl font-semibold">体验前请留意</h2><ul class="mt-5 grid gap-3 text-charcoal"><li v-for="note in tutorial.notes" :key="note">· {{ note }}</li></ul></div></section>
    <section class="page-wrap pb-16 md:pb-24"><div class="rounded-[2.5rem] bg-ink px-7 py-14 text-center text-white md:px-14 md:py-20"><p class="eyebrow text-[#f1a17b]">BOOK YOUR EXPERIENCE</p><h2 class="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ isPreparing ? `咨询${tutorial.title}` : `预约${tutorial.title}` }}</h2><p class="mx-auto mt-5 max-w-2xl leading-8 text-white/65">{{ tutorial.consultationTip || blocks.booking.description }}</p><div class="mt-8 flex flex-wrap justify-center gap-3"><button type="button" class="rounded-full bg-fire px-7 py-4 font-semibold" @click="handleBooking">添加微信{{ isPreparing ? '咨询' : '预约' }}</button><NuxtLink v-if="hasTutorial" :to="`/diy/${tutorial.slug}/tutorial`" class="rounded-full border border-white/30 px-7 py-4 font-semibold">查看教程</NuxtLink></div></div></section>
    <DiyBookingModal :site="site" :experience-name="tutorial.title" /><DiyMobileBookingBar />
  </div>
</template>
