<script setup lang="ts">
import { images } from '~/data/fallback'
const { tutorials } = useContent()
const { data: list } = await useAsyncData('tutorials', tutorials)
useSeoMeta({ title: '手作体验', description: '查看面包DIY与披萨DIY流程，亲手完成一份窑烤作品。' })
</script>
<template><div><PageHero eyebrow="MAKE IT YOURSELF" title="这一次，换你来做。" description="从面团到出炉，每一步都能亲手参与。教程用于出发前了解流程，实际体验安排请提前联系门店确认。" :image="images.pizza" image-alt="披萨手作氛围示意图，待替换为门店DIY实拍"><NuxtLink to="/visit#contact" class="btn-primary">咨询手作体验</NuxtLink></PageHero><section class="page-wrap py-16 md:py-24"><div class="grid gap-8 md:grid-cols-2"><NuxtLink v-for="item in list" :key="item.id" :to="`/diy/${item.slug}`" class="paper-card group overflow-hidden"><div class="aspect-[16/10] overflow-hidden"><img :src="item.image" :alt="item.imageAlt" class="image-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"></div><div class="p-7 md:p-9"><p class="eyebrow">{{ item.type }}</p><h2 class="mt-3 font-serif text-3xl font-semibold">{{ item.title }}</h2><p class="mt-4 leading-8 text-charcoal">{{ item.summary }}</p><div class="mt-6 flex gap-4 text-sm font-semibold"><span>{{ item.duration }}</span><span>{{ item.people }}</span></div><span class="mt-7 inline-block border-b border-ink pb-1 font-semibold">查看步骤 →</span></div></NuxtLink></div></section><ContactPanel /></div></template>

