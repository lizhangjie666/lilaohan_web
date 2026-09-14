<script setup lang="ts">
import type { Tutorial } from '~/types/content'

const props = withDefaults(defineProps<{
  tutorial: Tutorial
  index?: number
  variant?: 'featured' | 'standard' | 'compact'
}>(), {
  index: 0,
  variant: 'standard',
})

const isPreparing = computed(() => props.tutorial.experienceStatus === '内容筹备中')
const hasTutorial = computed(() => !isPreparing.value && props.tutorial.steps.length > 0)
const cardNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const sizeClass = computed(() => ({
  featured: 'min-h-[32rem] sm:min-h-[38rem] lg:min-h-[39rem]',
  standard: 'min-h-[25rem] lg:min-h-[19rem]',
  compact: 'min-h-[23rem] lg:min-h-[19rem]',
}[props.variant]))
</script>

<template>
  <article
    :id="`experience-${tutorial.slug}`"
    class="group relative isolate flex scroll-mt-28 overflow-hidden rounded-[2rem] bg-[#312720] text-white shadow-[0_24px_70px_rgba(41,28,20,.14)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(41,28,20,.22)] focus-within:ring-2 focus-within:ring-fire focus-within:ring-offset-4 focus-within:ring-offset-[#f5ead9]"
    :class="sizeClass"
  >
    <NuxtLink
      :to="`/diy/${tutorial.slug}`"
      class="absolute inset-0 z-20 rounded-[2rem] focus:outline-none"
      :aria-label="`了解${tutorial.title}`"
    />

    <ContentImage
      v-if="tutorial.image"
      :image="tutorial.image"
      :alt="tutorial.imageAlt || tutorial.title"
      :sizes="variant === 'featured' ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 36vw, (min-width: 640px) 50vw, 100vw'"
      class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
    />
    <div v-else class="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(214,113,69,.35),transparent_28%),linear-gradient(145deg,#544137,#29211c)]">
      <span class="absolute right-6 top-12 font-serif text-[7rem] leading-none text-white/[.07] sm:text-[9rem]">{{ cardNumber }}</span>
      <span class="absolute right-7 top-7 text-[10px] font-bold tracking-[.2em] text-white/45">体验照片待上传</span>
    </div>

    <div class="absolute inset-0 bg-gradient-to-t from-[#211a16] via-[#211a16]/55 to-transparent" />
    <div v-if="variant === 'featured'" class="absolute inset-0 bg-[linear-gradient(105deg,rgba(28,21,17,.58),transparent_68%)]" />

    <div class="relative z-10 mt-auto w-full p-6 sm:p-8" :class="variant === 'featured' ? 'lg:max-w-[78%] lg:p-10' : ''">
      <div class="flex flex-wrap items-center gap-2">
        <span v-if="variant === 'featured'" class="rounded-full bg-fire px-4 py-2 text-[11px] font-bold tracking-[.15em] text-white">主推体验</span>
        <span v-if="isPreparing" class="rounded-full border border-white/25 bg-ink/65 px-4 py-2 text-[11px] font-bold tracking-[.12em] text-white backdrop-blur">内容筹备中</span>
        <span v-else class="text-[11px] font-bold tracking-[.18em] text-[#f3aa84]">{{ cardNumber }} · {{ tutorial.type }}</span>
      </div>

      <h2 class="mt-4 font-serif font-semibold leading-tight" :class="variant === 'featured' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl lg:text-[2rem]'">{{ tutorial.title }}</h2>
      <p v-if="tutorial.summary" class="mt-4 line-clamp-3 leading-7 text-white/72" :class="variant === 'compact' ? 'text-sm' : 'text-base'">{{ tutorial.summary }}</p>

      <div v-if="tutorial.duration || tutorial.people" class="mt-5 flex flex-wrap gap-2 text-xs text-white/75">
        <span v-if="tutorial.duration" class="rounded-full border border-white/20 bg-black/10 px-3 py-2 backdrop-blur-sm">{{ tutorial.duration }}</span>
        <span v-if="tutorial.people" class="max-w-full truncate rounded-full border border-white/20 bg-black/10 px-3 py-2 backdrop-blur-sm">{{ tutorial.people }}</span>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <span class="font-semibold text-white">了解体验 →</span>
        <NuxtLink
          v-if="hasTutorial"
          :to="`/diy/${tutorial.slug}/tutorial`"
          class="relative z-30 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          :aria-label="`查看${tutorial.title}教程`"
        >查看教程</NuxtLink>
      </div>
    </div>
  </article>
</template>
