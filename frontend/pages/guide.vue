<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const { spots, settings, pageSections } = useContent()
const [{ data: list }, { data: site }, { data: sectionList }] = await Promise.all([
  useAsyncData('spots', spots),
  useAsyncData('guide-settings', settings),
  useAsyncData('guide-sections', () => pageSections('guide')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['guide.hero', 'guide.overview', 'guide.empty', 'guide.return']))
useSeoMeta({ title: '镇山村打卡指南', description: '从李老汉窑烤面包出发，发现镇山村的湖边、石板路与窑炉边拍摄机位。' })
</script>

<template>
  <div>
    <PageHero tone="lake" :eyebrow="blocks.hero.eyebrow" :title="blocks.hero.title" :description="blocks.hero.description" :image="blocks.hero.image || site?.guideHeroImage" :image-alt="blocks.hero.image ? blocks.hero.imageAlt : site?.guideHeroImageAlt" />
    <section class="page-wrap py-16 md:py-24">
      <div class="mb-12 grid gap-6 border-b border-ink/15 pb-10 md:grid-cols-3">
        <div v-for="item in blocks.overview.items" :key="item.title"><ContentImage v-if="item.image" :image="item.image" :alt="item.imageAlt" sizes="(min-width: 768px) 33vw, 100vw" class="mb-5 aspect-[16/9] w-full rounded-2xl object-cover" /><p class="eyebrow">{{ item.eyebrow }}</p><p class="mt-3 font-serif text-2xl">{{ item.title }}</p><p v-if="item.text" class="mt-3 leading-7 text-charcoal">{{ item.text }}</p><NuxtLink v-if="item.buttonText && item.buttonLink?.startsWith('/')" :to="item.buttonLink" class="mt-4 inline-block border-b border-ink font-semibold">{{ item.buttonText }}</NuxtLink><a v-else-if="item.buttonText && item.buttonLink" :href="item.buttonLink" class="mt-4 inline-block border-b border-ink font-semibold" target="_blank" rel="noopener">{{ item.buttonText }}</a></div>
      </div>
      <div class="grid gap-8">
        <article v-for="(spot, index) in list" :key="spot.id" class="paper-card grid overflow-hidden md:grid-cols-[1.05fr_0.95fr]">
          <div class="aspect-[4/3] min-h-full overflow-hidden"><ContentImage :image="spot.image" :alt="spot.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="image-cover" /></div>
          <div class="flex flex-col justify-center p-7 md:p-10">
            <p class="eyebrow">STOP {{ String(index + 1).padStart(2, '0') }}</p><h2 class="mt-3 font-serif text-3xl font-semibold md:text-4xl">{{ spot.name }}</h2><p class="mt-5 leading-8 text-charcoal">{{ spot.summary }}</p>
            <dl class="mt-7 grid gap-4 text-sm"><div><dt class="font-semibold">推荐时间</dt><dd class="mt-1 text-charcoal">{{ spot.bestTime }}</dd></div><div><dt class="font-semibold">从店里出发</dt><dd class="mt-1 text-charcoal">{{ spot.walk }}</dd></div><div><dt class="font-semibold">拍摄建议</dt><dd class="mt-1 text-charcoal">{{ spot.direction }}</dd></div></dl>
            <a v-if="spot.mapUrl" :href="spot.mapUrl" class="btn-primary mt-7 self-start" target="_blank" rel="noopener">导航到这里</a><span v-else class="mt-7 text-sm font-semibold text-fire">点位待实地确认后开放导航</span>
          </div>
        </article>
        <div v-if="!list?.length" class="rounded-[2rem] border border-ink/15 bg-white px-6 py-16 text-center"><h2 class="font-serif text-3xl font-semibold">{{ blocks.empty.title }}</h2><p class="mt-4 text-charcoal">{{ blocks.empty.description }}</p></div>
      </div>
    </section>
    <section class="bg-lake py-16 text-white"><div class="page-wrap text-center"><p class="whitespace-pre-line font-serif text-3xl md:text-5xl">{{ blocks.return.title }}</p><NuxtLink v-if="blocks.return.primaryButtonText" :to="blocks.return.primaryButtonLink || '/menu'" class="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-lake">{{ blocks.return.primaryButtonText }}</NuxtLink></div></section>
  </div>
</template>
