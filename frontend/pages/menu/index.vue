<script setup lang="ts">
import { images } from '~/data/fallback'
const { products } = useContent()
const { data: list } = await useAsyncData('products', products)
const categories = computed(() => ['全部', ...new Set((list.value || []).map(item => item.category))])
const active = ref('全部')
const visible = computed(() => active.value === '全部' ? list.value : list.value?.filter(item => item.category === active.value))
useSeoMeta({ title: '窑烤菜单', description: '查看李老汉窑烤面包的面包、披萨、烤鸡、咖啡、围炉煮茶与冷饮。' })
</script>

<template>
  <div><PageHero eyebrow="WOOD-FIRED MENU" title="窑里今天，正在发生什么。" description="菜单随出炉节奏、季节和当天备料更新。页面价格为参考，具体供应请以门店当天为准。" :image="images.bread" image-alt="手工面包氛围示意图，待替换为门店实拍" />
    <section class="page-wrap py-14 md:py-20"><div class="flex gap-2 overflow-x-auto pb-4" role="tablist" aria-label="产品分类"><button v-for="category in categories" :key="category" class="shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition" :class="active === category ? 'bg-ink text-white' : 'border border-ink/15 bg-transparent'" @click="active = category">{{ category }}</button></div><div class="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3"><ProductCard v-for="item in visible" :key="item.id" :product="item" /></div></section><ContactPanel /></div>
</template>

