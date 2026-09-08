<script setup lang="ts">
const { tutorials, settings } = useContent()
const [{ data: list }, { data: site }] = await Promise.all([
  useAsyncData('tutorials', tutorials),
  useAsyncData('diy-settings', settings),
])
useSeoMeta({ title: '手作体验', description: '查看面包DIY与披萨DIY流程，亲手完成一份窑烤作品。' })
</script>

<template>
  <div>
    <PageHero eyebrow="MAKE IT YOURSELF" title="这一次，换你来做。" description="从面团到出炉，每一步都能亲手参与。教程用于出发前了解流程，实际体验安排请提前联系门店确认。" :image="site?.diyHeroImage" :image-alt="site?.diyHeroImageAlt">
      <NuxtLink to="/visit#contact" class="btn-primary">咨询手作体验</NuxtLink>
    </PageHero>
    <section class="page-wrap py-16 md:py-24">
      <div v-if="list?.length" class="grid gap-8 md:grid-cols-2">
        <NuxtLink v-for="item in list" :key="item.id" :to="`/diy/${item.slug}`" class="paper-card group overflow-hidden">
          <div class="aspect-[16/10] overflow-hidden"><img :src="item.image" :alt="item.imageAlt" class="image-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"></div>
          <div class="p-7 md:p-9"><p class="eyebrow">{{ item.type }}</p><h2 class="mt-3 font-serif text-3xl font-semibold">{{ item.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ item.summary }}</p><div class="mt-6 flex gap-4 text-sm font-semibold"><span>{{ item.duration }}</span><span>{{ item.people }}</span></div><span class="mt-7 inline-block border-b border-ink pb-1 font-semibold">查看步骤 →</span></div>
        </NuxtLink>
      </div>
      <div v-else class="rounded-[2rem] border border-ink/15 bg-white px-6 py-16 text-center"><h2 class="font-serif text-3xl font-semibold">手作体验正在整理</h2><p class="mt-4 text-charcoal">具体体验项目和时间请先联系门店确认。</p></div>
    </section>
    <ContactPanel />
  </div>
</template>
