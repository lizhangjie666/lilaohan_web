<script setup lang="ts">
import type { PageSectionItem } from '~/types/content'
defineProps<{ items: PageSectionItem[]; fallbackTitle?: string }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
    <article v-for="(item, index) in items" :key="`${item.title}-${index}`" v-reveal="index * 65" class="motion-reveal group relative min-h-52 overflow-hidden rounded-[1.75rem] bg-[#d9c49f] md:min-h-72" :class="index % 3 === 0 ? 'md:row-span-2 md:min-h-[37rem]' : ''">
      <ContentImage v-if="item.image" :image="item.image" :alt="item.imageAlt || item.title" sizes="(min-width:768px) 34vw, 50vw" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      <div v-else class="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_65%_20%,rgba(229,83,24,.18),transparent_35%),linear-gradient(145deg,#efdfbf,#cdb386)]"><span class="text-center text-xs tracking-[.18em] text-ink/50">{{ fallbackTitle || '真实照片待上传' }}</span></div>
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-5 pt-14 text-white"><h3 class="font-serif text-lg font-semibold md:text-2xl">{{ item.title }}</h3><p v-if="item.text" class="mt-2 text-sm leading-6 text-white/75">{{ item.text }}</p></div>
    </article>
  </div>
</template>
