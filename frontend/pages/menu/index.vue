<script setup lang="ts">
const { products, settings } = useContent()
const [{ data: list }, { data: site }] = await Promise.all([
  useAsyncData('products', products),
  useAsyncData('menu-settings', settings),
])
const categories = computed(() => ['全部', ...new Set((list.value || []).map(item => item.category).filter(Boolean))])
const active = ref('全部')
const visible = computed(() => active.value === '全部' ? list.value : list.value?.filter(item => item.category === active.value))
useSeoMeta({ title: '窑烤菜单', description: '查看李老汉窑烤面包的面包、披萨、烤鸡、咖啡、围炉煮茶与冷饮。' })
</script>

<template>
  <div>
    <PageHero eyebrow="WOOD-FIRED MENU" title="窑里今天，正在发生什么。" description="菜单随出炉节奏、季节和当天备料更新。页面价格为参考，具体供应请以门店当天为准。" :image="site?.menuHeroImage" :image-alt="site?.menuHeroImageAlt" />
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
        <h2 class="font-serif text-3xl font-semibold">当前菜单待更新</h2>
        <p class="mt-4 text-charcoal">门店正在整理当天供应内容，出发前可通过电话或微信咨询。</p>
        <NuxtLink to="/visit#contact" class="btn-primary mt-7">联系门店</NuxtLink>
      </div>
    </section>
    <ContactPanel />
  </div>
</template>
