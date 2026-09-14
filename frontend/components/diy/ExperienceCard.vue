<script setup lang="ts">
import type { Tutorial } from '~/types/content'

const props = defineProps<{ tutorial: Tutorial; index?: number; featured?: boolean }>()
const isPreparing = computed(() => props.tutorial.experienceStatus === '内容筹备中')
const hasTutorial = computed(() => !isPreparing.value && props.tutorial.steps.length > 0)
</script>

<template>
  <article class="group relative h-full overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fire/45 hover:shadow-xl focus-within:border-fire/60" :class="featured ? 'sm:col-span-2 lg:col-span-2 sm:grid sm:grid-cols-[1.15fr_.85fr]' : 'flex flex-col'">
    <NuxtLink :to="`/diy/${tutorial.slug}`" class="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire" :aria-label="`了解${tutorial.title}`" />
    <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#ead7b4] via-[#f5e7ce] to-[#d8bb8a]" :class="featured ? 'sm:aspect-auto sm:min-h-[25rem]' : ''">
      <ContentImage v-if="tutorial.image" :image="tutorial.image" :alt="tutorial.imageAlt || tutorial.title" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <div v-else class="absolute inset-0 flex items-end justify-between p-6">
        <span class="font-serif text-7xl text-ink/10">{{ String((index || 0) + 1).padStart(2, '0') }}</span>
        <span class="text-xs tracking-[.16em] text-ink/45">体验照片待上传</span>
      </div>
      <span v-if="featured" class="absolute left-5 top-5 rounded-full bg-fire px-4 py-2 text-xs font-bold tracking-[.14em] text-white shadow-lg">主推体验</span>
      <span v-if="isPreparing" class="absolute right-5 top-5 rounded-full bg-ink/80 px-4 py-2 text-xs font-bold tracking-[.14em] text-white backdrop-blur">内容筹备中</span>
    </div>
    <div class="relative flex flex-1 flex-col p-6 sm:p-7">
      <h3 class="font-serif text-2xl font-semibold leading-tight text-fire sm:text-3xl">{{ tutorial.title }}</h3>
      <p v-if="tutorial.summary" class="mt-4 line-clamp-3 leading-7 text-charcoal">{{ tutorial.summary }}</p>
      <div v-if="tutorial.duration || tutorial.people" class="mt-5 flex flex-wrap gap-2 text-xs text-charcoal">
        <span v-if="tutorial.duration" class="rounded-full bg-flour px-3 py-2">{{ tutorial.duration }}</span>
        <span v-if="tutorial.people" class="rounded-full bg-flour px-3 py-2">{{ tutorial.people }}</span>
      </div>
      <div class="mt-auto flex items-center justify-between gap-3 pt-7">
        <span class="font-semibold text-ink">了解体验 →</span>
        <NuxtLink v-if="hasTutorial" :to="`/diy/${tutorial.slug}/tutorial`" class="relative z-20 rounded-full bg-fire px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bd4529] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-fire" :aria-label="`查看${tutorial.title}教程`">查看教程</NuxtLink>
      </div>
    </div>
  </article>
</template>
