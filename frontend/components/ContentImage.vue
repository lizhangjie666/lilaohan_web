<script setup lang="ts">
import type { ImageAsset, ImageSource } from '~/types/content'

const props = withDefaults(defineProps<{
  image?: ImageSource
  alt?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
}>(), {
  alt: '',
  sizes: '100vw',
  loading: 'lazy',
  fetchpriority: 'auto',
  decoding: 'async',
})

const asset = computed<ImageAsset>(() => typeof props.image === 'string'
  ? { src: props.image }
  : props.image || { src: '' })
</script>

<template>
  <img
    v-if="asset.src"
    :src="asset.src"
    :srcset="asset.srcset"
    :sizes="asset.srcset ? sizes : undefined"
    :width="asset.width"
    :height="asset.height"
    :alt="alt || asset.alt || ''"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
  >
</template>
