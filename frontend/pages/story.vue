<script setup lang="ts">
const { story } = useContent()
const { data: content } = await useAsyncData('brand-story', story)
const defaultStages = [
  { n: '01', title: '生火', text: '一天从窑炉升温开始。具体木柴、升温时间与工艺细节待店主补充。' },
  { n: '02', title: '发酵', text: '给面团足够时间，具体配方与发酵方式由店主在后台维护。' },
  { n: '03', title: '入窑', text: '根据当天炉温和产品状态调整位置与时间。' },
  { n: '04', title: '出炉', text: '颜色、香气和触感共同决定这一炉是否完成。' },
]
const stages = computed(() => content.value?.process.length ? content.value.process : defaultStages)
useSeoMeta({ title: '关于我们', description: '认识镇山村里的李老汉窑烤面包，以及一炉火从生起到出炉的过程。' })
</script>

<template>
  <div>
    <PageHero tone="dark" eyebrow="OUR FIRE, OUR VILLAGE" title="在村里生一炉火，做当天的面包。" :description="content?.origin" :image="content?.heroImage" :image-alt="content?.heroImageAlt" />
    <section class="page-wrap py-20 md:py-32"><div class="mx-auto max-w-3xl text-center"><p class="eyebrow">为什么在这里</p><h2 class="section-title mt-5">{{ content?.originTitle }}</h2><p class="body-copy mt-8 whitespace-pre-line">{{ content?.origin }}</p></div></section>
    <section class="bg-[#eadbc8] py-20"><div class="page-wrap"><div class="grid gap-6 md:grid-cols-4"><article v-for="stage in stages" :key="`${stage.n}-${stage.title}`" class="border-t border-ink/30 pt-5"><span class="font-serif text-4xl text-fire">{{ stage.n }}</span><h2 class="mt-6 font-serif text-2xl font-semibold">{{ stage.title }}</h2><p class="mt-3 leading-7 text-charcoal">{{ stage.text }}</p></article></div></div></section>
    <section class="page-wrap grid items-center gap-10 py-20 md:grid-cols-2 md:py-28"><div class="aspect-[4/3] overflow-hidden rounded-[2rem]"><img :src="content?.teamImage" :alt="content?.teamImageAlt" class="image-cover" loading="lazy"></div><div><p class="eyebrow">THE PEOPLE BEHIND THE OVEN</p><h2 class="section-title mt-5">做面包的人，<br>也在过村里的日常。</h2><p class="body-copy mt-6 whitespace-pre-line">{{ content?.teamIntro }}</p></div></section>
    <section v-if="content?.gallery.length" class="page-wrap pb-20 md:pb-28"><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><img v-for="photo in content.gallery" :key="photo.url" :src="photo.url" :alt="photo.alt" class="aspect-[4/3] w-full rounded-[1.5rem] object-cover" loading="lazy"></div></section>
    <ContactPanel />
  </div>
</template>
