<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'
const { tutorials, settings, pageSections } = useContent()
const [{ data: list }, { data: site }, { data: sectionList }] = await Promise.all([
  useAsyncData('tutorials', tutorials),
  useAsyncData('diy-settings', settings),
  useAsyncData('diy-sections', () => pageSections('diy')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy.hero', 'diy.empty']))
useSeoMeta({ title: '手作体验', description: '查看面包DIY与披萨DIY流程，亲手完成一份窑烤作品。' })
</script>

<template>
  <div>
    <PageHero :eyebrow="blocks.hero.eyebrow" :title="blocks.hero.title" :description="blocks.hero.description" :image="blocks.hero.image || site?.diyHeroImage" :image-alt="blocks.hero.image ? blocks.hero.imageAlt : site?.diyHeroImageAlt">
      <NuxtLink v-if="blocks.hero.primaryButtonText" :to="blocks.hero.primaryButtonLink || '/visit#contact'" class="btn-primary">{{ blocks.hero.primaryButtonText }}</NuxtLink>
    </PageHero>
    <section class="page-wrap py-16 md:py-24">
      <div v-if="list?.length" class="grid gap-8 md:grid-cols-2">
        <NuxtLink v-for="item in list" :key="item.id" :to="`/diy/${item.slug}`" class="paper-card group overflow-hidden">
          <div class="aspect-[16/10] overflow-hidden"><ContentImage :image="item.image" :alt="item.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="image-cover transition duration-500 group-hover:scale-[1.03]" /></div>
          <div class="p-7 md:p-9"><p class="eyebrow">{{ item.type }}</p><h2 class="mt-3 font-serif text-3xl font-semibold">{{ item.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ item.summary }}</p><div class="mt-6 flex gap-4 text-sm font-semibold"><span>{{ item.duration }}</span><span>{{ item.people }}</span></div><span class="mt-7 inline-block border-b border-ink pb-1 font-semibold">查看步骤 →</span></div>
        </NuxtLink>
      </div>
      <div v-else class="rounded-[2rem] border border-ink/15 bg-white px-6 py-16 text-center"><h2 class="font-serif text-3xl font-semibold">{{ blocks.empty.title }}</h2><p class="mt-4 text-charcoal">{{ blocks.empty.description }}</p></div>
    </section>
    <ContactPanel />
  </div>
</template>
