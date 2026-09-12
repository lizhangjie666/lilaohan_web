<script setup lang="ts">
import type { DiyResourceItem } from '~/types/content'
defineProps<{ items: DiyResourceItem[]; emptyNames?: string[] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    <article v-for="(item, index) in (items.length ? items : (emptyNames || []).map(name => ({ name, imageAlt: `${name}图片` })))" :key="`${item.name}-${index}`" v-reveal="index * 60" class="motion-reveal overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white">
      <div class="relative aspect-square overflow-hidden bg-[#ead9b8]">
        <ContentImage v-if="item.image" :image="item.image" :alt="item.imageAlt" sizes="(min-width:1024px) 25vw, 50vw" class="h-full w-full object-cover transition duration-500 hover:scale-105" />
        <span v-if="item.isIllustration" class="absolute right-2 top-2 rounded-full bg-ink/75 px-2.5 py-1 text-[9px] font-semibold tracking-[.1em] text-white backdrop-blur-sm">AI 示意图</span>
        <div v-else class="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.8),transparent_28%),linear-gradient(155deg,#f3e5c9,#d7bd8d)]"><span class="text-xs tracking-[.16em] text-ink/45">真实照片待上传</span></div>
      </div>
      <h3 class="px-4 py-4 text-center font-semibold">{{ item.name }}</h3>
    </article>
  </div>
</template>
