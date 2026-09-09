<script setup lang="ts">
import { pageSectionDefaults } from '~/data/page-sections'
const { settings, pageSections } = useContent()
const [{ data }, { data: globalSections }] = await Promise.all([
  useAsyncData('site-settings', settings),
  useAsyncData('contact-sections', () => pageSections('global')),
])
const config = useRuntimeConfig()
const current = computed(() => ({ ...data.value, phone: config.public.phone || data.value?.phone, wechat: config.public.wechat || data.value?.wechat, amapUrl: config.public.amapUrl || data.value?.amapUrl }))
const content = computed(() => globalSections.value?.find(item => item.sectionKey === 'global.contact') || pageSectionDefaults['global.contact'])
const visitText = computed(() => content.value.description || [
  current.value.address,
  [current.value.hours, current.value.parking].filter(Boolean).join(' · '),
].filter(Boolean).join('\n'))
</script>

<template>
  <section class="relative isolate overflow-hidden bg-fire py-14 text-white md:py-20">
    <img v-if="content.image" :src="content.image" :alt="content.imageAlt" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-30">
    <div v-if="content.image" class="absolute inset-0 -z-10 bg-fire/80" />
    <div class="page-wrap grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
      <div><p class="text-xs font-semibold tracking-[0.2em] text-white/65">{{ content.eyebrow }}</p><h2 class="mt-4 whitespace-pre-line font-serif text-4xl font-semibold md:text-6xl">{{ content.title }}</h2><p class="mt-5 max-w-2xl whitespace-pre-line leading-8 text-white/75">{{ visitText }}</p></div>
      <div class="flex flex-wrap gap-3 md:justify-end"><a v-if="current.amapUrl" :href="current.amapUrl" class="btn-secondary border-white/30 bg-white text-ink" target="_blank" rel="noopener">{{ content.primaryButtonText }}</a><NuxtLink v-else :to="content.primaryButtonLink || '/visit'" class="btn-secondary border-white/30 bg-white text-ink">{{ content.primaryButtonText || '查看到店信息' }}</NuxtLink><a v-if="current.phone" :href="`tel:${current.phone}`" class="btn-secondary border-white/30 bg-transparent text-white">{{ content.secondaryButtonText }}</a><NuxtLink v-else :to="content.secondaryButtonLink || '/visit#contact'" class="btn-secondary border-white/30 bg-transparent text-white">{{ content.secondaryButtonText || '联系方式待确认' }}</NuxtLink></div>
    </div>
  </section>
</template>
