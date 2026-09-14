<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const { tutorials, diySettings, pageSections } = useContent()
const [{ data: list }, { data: diy }, { data: sectionList }] = await Promise.all([
  useAsyncData('diy-catalog-tutorials', tutorials),
  useAsyncData('diy-catalog-promotion-settings', diySettings),
  useAsyncData('diy-catalog-sections', () => pageSections('diy-catalog')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy-catalog.hero', 'diy-catalog.list', 'diy-catalog.empty']))
const featuredSlug = computed(() => diy.value?.featuredTutorialSlug || 'bread-diy')
const featuredTutorial = computed(() => list.value?.find(item => item.slug === featuredSlug.value) || list.value?.[0])
const remainingTutorials = computed(() => (list.value || []).filter(item => item.id !== featuredTutorial.value?.id))
const secondaryTutorial = computed(() => remainingTutorials.value[0])
const compactTutorials = computed(() => remainingTutorials.value.slice(1, 3))
const extraTutorials = computed(() => remainingTutorials.value.slice(3))

useSeoMeta({
  title: '手作体验｜李老汉窑烤面包',
  description: '在贵阳花溪镇山村体验窑烤面包、窑烤披萨等手作项目，查看项目介绍和详细制作教程。',
})
</script>

<template>
  <div class="min-h-screen bg-[#f5ead9]">
    <section class="overflow-hidden border-b border-ink/10 pb-16 pt-10 md:pb-24 md:pt-14">
      <div class="page-wrap">
        <header class="grid gap-7 border-b border-ink/15 pb-9 lg:grid-cols-[1.15fr_.85fr] lg:items-end" v-reveal>
          <div>
            <p class="eyebrow text-fire">{{ blocks.hero.eyebrow }}</p>
            <h1 class="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] text-ink sm:text-6xl lg:text-7xl">{{ blocks.hero.title }}</h1>
          </div>
          <div class="lg:pb-1">
            <p v-if="blocks.hero.description" class="max-w-2xl text-base leading-8 text-charcoal md:text-lg">{{ blocks.hero.description }}</p>
            <p v-if="blocks.list.description" class="mt-3 text-sm leading-7 text-charcoal/80">{{ blocks.list.description }}</p>
          </div>
        </header>

        <nav v-if="list?.length" class="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="体验项目快速索引">
          <a v-for="item in list" :key="item.id" :href="`#experience-${item.slug}`" class="grid min-h-12 place-items-center rounded-2xl border border-ink/15 bg-white/55 px-3 py-2 text-center text-xs font-semibold leading-5 text-ink transition hover:border-fire hover:text-fire sm:min-h-0 sm:shrink-0 sm:rounded-full sm:px-4 sm:py-2.5 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire">
            {{ item.slug === featuredTutorial?.slug ? '主推 · ' : '' }}{{ item.title }}
          </a>
        </nav>

        <div v-if="featuredTutorial" class="mt-7 grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <DiyCatalogCard v-reveal :tutorial="featuredTutorial" :index="0" variant="featured" class="lg:col-span-7 lg:row-span-2" />

          <div class="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-rows-2">
            <DiyCatalogCard v-if="secondaryTutorial" v-reveal="80" :tutorial="secondaryTutorial" :index="1" variant="standard" class="sm:col-span-2" />
            <DiyCatalogCard v-for="(item, index) in compactTutorials" :key="item.id" v-reveal="120 + index * 70" :tutorial="item" :index="index + 2" variant="compact" />
          </div>
        </div>

        <div v-if="extraTutorials.length" class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DiyCatalogCard v-for="(item, index) in extraTutorials" :key="item.id" v-reveal="index * 70" :tutorial="item" :index="index + 4" variant="standard" />
        </div>

        <div v-if="!list?.length" class="mt-10 rounded-[2rem] border border-ink/10 bg-white p-10 text-center">
          <h2 class="font-serif text-3xl font-semibold">{{ blocks.empty.title }}</h2>
          <p class="mt-4 text-charcoal">{{ blocks.empty.description }}</p>
        </div>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>
