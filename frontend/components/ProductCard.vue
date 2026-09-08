<script setup lang="ts">
import type { Product } from '~/types/content'
defineProps<{ product: Product }>()
</script>

<template>
  <article class="paper-card group overflow-hidden">
    <div class="aspect-[4/3] overflow-hidden"><img :src="product.image" :alt="product.imageAlt" class="image-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"></div>
    <div class="p-6"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold tracking-[0.16em] text-fire">{{ product.category }}</p><h2 class="mt-2 font-serif text-2xl font-semibold">{{ product.name }}</h2></div><span class="rounded-full px-3 py-1 text-xs" :class="product.available ? 'bg-[#e3eadb] text-[#36502e]' : 'bg-ink/10 text-charcoal'">{{ product.available ? '当天供应' : '暂停售罄' }}</span></div><p class="mt-4 leading-7 text-charcoal">{{ product.description }}</p><div class="mt-5 flex flex-wrap gap-2"><span v-for="tag in product.tags" :key="tag" class="rounded-full border border-ink/10 px-3 py-1 text-xs">{{ tag }}</span></div><p class="mt-5 text-sm font-semibold">{{ product.price }} <span class="font-normal text-charcoal">· 以门店当天为准</span></p></div>
  </article>
</template>

