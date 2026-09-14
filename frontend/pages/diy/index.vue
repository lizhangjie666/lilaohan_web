<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const { tutorials, settings, diySettings, pageSections } = useContent()
const [{ data: list }, { data: site }, { data: diy }, { data: sectionList }] = await Promise.all([
  useAsyncData('diy-catalog-tutorials', tutorials),
  useAsyncData('diy-catalog-settings', settings),
  useAsyncData('diy-catalog-promotion-settings', diySettings),
  useAsyncData('diy-catalog-sections', () => pageSections('diy-catalog')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy-catalog.hero', 'diy-catalog.list', 'diy-catalog.empty']))
const featuredSlug = computed(() => diy.value?.featuredTutorialSlug || 'bread-diy')

useSeoMeta({
  title: '手作体验｜李老汉窑烤面包',
  description: '在贵阳花溪镇山村体验窑烤面包、窑烤披萨等手作项目，查看项目介绍和详细制作教程。',
})
</script>

<template>
  <div class="bg-flour">
    <PageHero
      tone="dark"
      :eyebrow="blocks.hero.eyebrow"
      :title="blocks.hero.title"
      :description="blocks.hero.description"
      :image="blocks.hero.image || site?.diyHeroImage"
      :image-alt="blocks.hero.image ? blocks.hero.imageAlt : site?.diyHeroImageAlt"
    />

    <section class="page-wrap py-16 md:py-24">
      <div v-reveal class="max-w-3xl">
        <p class="eyebrow text-fire">{{ blocks.list.eyebrow }}</p>
        <h2 class="section-title mt-5 whitespace-pre-line">{{ blocks.list.title }}</h2>
        <p v-if="blocks.list.description" class="body-copy mt-6 whitespace-pre-line">{{ blocks.list.description }}</p>
      </div>

      <div v-if="list?.length" class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DiyExperienceCard v-for="(item, index) in list" :key="item.id" v-reveal="index * 80" :tutorial="item" :index="index" :featured="item.slug === featuredSlug" />
      </div>
      <div v-else class="mt-12 rounded-[2rem] border border-ink/10 bg-white p-10 text-center">
        <h2 class="font-serif text-3xl font-semibold">{{ blocks.empty.title }}</h2>
        <p class="mt-4 text-charcoal">{{ blocks.empty.description }}</p>
      </div>
    </section>

    <ContactPanel />
  </div>
</template>
