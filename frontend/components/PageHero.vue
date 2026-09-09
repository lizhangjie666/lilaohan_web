<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description: string; image?: string; imageAlt?: string; tone?: 'light' | 'dark' | 'lake' }>()
</script>

<template>
  <section :class="tone === 'lake' ? 'bg-lake text-white' : tone === 'dark' ? 'bg-ink text-flour' : 'bg-flour text-ink'">
    <div class="page-wrap grid min-h-[54vh] items-end gap-8 py-16 md:grid-cols-2 md:py-24">
      <div class="max-w-2xl"><p class="eyebrow" :class="tone ? 'text-[#ef8a69]' : ''">{{ eyebrow }}</p><h1 class="display-title mt-5 whitespace-pre-line">{{ title }}</h1><p class="mt-7 max-w-xl whitespace-pre-line text-base leading-8" :class="tone ? 'text-white/70' : 'text-charcoal'">{{ description }}</p><div class="mt-8"><slot /></div></div>
      <div v-if="image" class="aspect-[4/3] overflow-hidden rounded-[2rem]"><img :src="image" :alt="imageAlt || ''" class="image-cover" loading="eager"></div>
    </div>
  </section>
</template>
