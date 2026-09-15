<script setup lang="ts">
import type { ImageSource } from '~/types/content'

withDefaults(defineProps<{
  image: ImageSource
  alt?: string
  sizes?: string
}>(), {
  alt: '',
  sizes: '(min-width: 1024px) 33vw, 50vw',
})
</script>

<template>
  <div class="absolute inset-0 isolate overflow-hidden bg-[#332a25]">
    <ContentImage
      :image="image"
      alt=""
      :sizes="sizes"
      aria-hidden="true"
      class="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] scale-110 object-cover opacity-45 blur-xl"
    />
    <div class="absolute inset-0 bg-black/10" aria-hidden="true" />
    <ContentImage
      :image="image"
      :alt="alt"
      :sizes="sizes"
      class="relative z-10 h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]"
    />
  </div>
</template>
