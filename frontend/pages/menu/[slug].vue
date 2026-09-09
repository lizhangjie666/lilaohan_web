<script setup lang="ts">
const route = useRoute()
import { mergePageSections } from '~/data/page-sections'
const { products, pageSections } = useContent()
const [{ data: list }, { data: sectionList }] = await Promise.all([
  useAsyncData('product-detail', products),
  useAsyncData('product-detail-sections', () => pageSections('product-detail')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['product-detail.actions']))
const product = computed(() => list.value?.find(item => item.slug === route.params.slug))
if (!product.value) throw createError({ statusCode: 404, statusMessage: '没有找到这款产品' })
useSeoMeta({ title: () => product.value?.name || '产品详情', description: () => product.value?.description })
</script>
<template><div v-if="product" class="page-wrap py-16 md:py-24"><NuxtLink to="/menu" class="text-sm font-semibold text-fire">← 返回菜单</NuxtLink><div class="mt-8 grid gap-12 md:grid-cols-2"><div class="aspect-[4/3] overflow-hidden rounded-[2rem]"><img :src="product.image" :alt="product.imageAlt" class="image-cover"></div><div class="self-center"><p class="eyebrow">{{ product.category }}</p><h1 class="display-title mt-5">{{ product.name }}</h1><p class="body-copy mt-7">{{ product.description }}</p><div class="mt-6 flex flex-wrap gap-2"><span v-for="tag in product.tags" :key="tag" class="rounded-full border border-ink/15 px-4 py-2 text-sm">{{ tag }}</span></div><p class="mt-8 font-semibold">{{ product.price }} · {{ blocks.actions.description }}</p><NuxtLink :to="blocks.actions.primaryButtonLink || '/visit'" class="btn-primary mt-8">{{ blocks.actions.primaryButtonText }}</NuxtLink></div></div></div></template>
