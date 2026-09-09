<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'
const { products, settings, pageSections } = useContent()
const [{ data: list }, { data: site }, { data: sectionList }] = await Promise.all([
  useAsyncData('products', products),
  useAsyncData('menu-settings', settings),
  useAsyncData('menu-sections', () => pageSections('menu')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['menu.hero', 'menu.empty']))
const categories = computed(() => ['全部', ...new Set((list.value || []).map(item => item.category).filter(Boolean))])
const active = ref('全部')
const visible = computed(() => active.value === '全部' ? list.value : list.value?.filter(item => item.category === active.value))
useSeoMeta({ title: '窑烤菜单', description: '查看李老汉窑烤面包的面包、披萨、烤鸡、咖啡、围炉煮茶与冷饮。' })
</script>

<template>
  <div>
    <PageHero :eyebrow="blocks.hero.eyebrow" :title="blocks.hero.title" :description="blocks.hero.description" :image="blocks.hero.image || site?.menuHeroImage" :image-alt="blocks.hero.image ? blocks.hero.imageAlt : site?.menuHeroImageAlt" />
    <section class="page-wrap py-14 md:py-20">
      <template v-if="list?.length">
        <div class="flex gap-2 overflow-x-auto pb-4" role="tablist" aria-label="产品分类">
          <button v-for="category in categories" :key="category" class="shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition" :class="active === category ? 'bg-ink text-white' : 'border border-ink/15 bg-transparent'" @click="active = category">{{ category }}</button>
        </div>
        <div class="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="item in visible" :key="item.id" :product="item" />
        </div>
      </template>
      <div v-else class="rounded-[2rem] border border-ink/15 bg-white px-6 py-16 text-center">
        <h2 class="font-serif text-3xl font-semibold">{{ blocks.empty.title }}</h2>
        <p class="mt-4 text-charcoal">{{ blocks.empty.description }}</p>
        <NuxtLink v-if="blocks.empty.primaryButtonText" :to="blocks.empty.primaryButtonLink || '/visit#contact'" class="btn-primary mt-7">{{ blocks.empty.primaryButtonText }}</NuxtLink>
      </div>
    </section>
    <ContactPanel />
  </div>
</template>
