<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const route = useRoute()
const { tutorials, pageSections } = useContent()
const [{ data: list }, { data: sectionList }] = await Promise.all([
  useAsyncData(`tutorial-${String(route.params.slug)}`, tutorials),
  useAsyncData('diy-detail-sections', () => pageSections('diy-detail')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy-detail.preparation', 'diy-detail.steps', 'diy-detail.notes']))
const tutorial = computed(() => list.value?.find(item => item.slug === route.params.slug))
if (!tutorial.value) throw createError({ statusCode: 404, statusMessage: '没有找到这份教程' })
if (tutorial.value.experienceStatus === '内容筹备中' || !tutorial.value.steps.length) {
  throw createError({ statusCode: 404, statusMessage: '教程尚未发布' })
}

useSeoMeta({ title: () => `${tutorial.value?.title || '手作体验'}教程`, description: () => tutorial.value?.summary })
useHead({ script: [{ type: 'application/ld+json', innerHTML: computed(() => JSON.stringify({ '@context': 'https://schema.org', '@type': 'HowTo', name: `${tutorial.value?.title}教程`, description: tutorial.value?.summary, step: tutorial.value?.steps.map(step => ({ '@type': 'HowToStep', name: step.title, text: step.description })) })) }] })
</script>

<template>
  <div v-if="tutorial">
    <section class="bg-ink py-16 text-flour md:py-24">
      <div class="page-wrap">
        <div class="flex flex-wrap gap-5 text-sm font-semibold text-[#ff9b78]"><NuxtLink to="/diy">← 全部体验</NuxtLink><NuxtLink :to="`/diy/${tutorial.slug}`">查看项目介绍</NuxtLink></div>
        <div class="mt-8 grid items-end gap-10 md:grid-cols-2">
          <div><p class="eyebrow">{{ tutorial.type }} · 教程</p><h1 class="display-title mt-5">{{ tutorial.title }}</h1><p class="mt-7 text-lg leading-8 text-flour/65">{{ tutorial.summary }}</p><div class="mt-8 flex flex-wrap gap-3"><span v-if="tutorial.duration" class="rounded-full border border-white/15 px-4 py-2 text-sm">{{ tutorial.duration }}</span><span v-if="tutorial.people" class="rounded-full border border-white/15 px-4 py-2 text-sm">{{ tutorial.people }}</span></div><a v-if="tutorial.videoUrl" :href="tutorial.videoUrl" class="btn-primary mt-7" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> {{ tutorial.videoLabel || '观看演示视频' }}</a></div>
          <div class="aspect-[4/3] overflow-hidden rounded-[2rem]"><ContentImage v-if="tutorial.image" :image="tutorial.image" :alt="tutorial.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="image-cover" loading="eager" /><div v-else class="grid h-full place-items-center bg-[#49372e] text-flour/60">教程封面待上传</div></div>
        </div>
      </div>
    </section>
    <section class="page-wrap grid gap-12 py-16 md:grid-cols-[0.7fr_1.3fr] md:py-24">
      <aside><p class="eyebrow">{{ blocks.preparation.eyebrow }}</p><p v-if="blocks.preparation.description" class="mt-4 text-charcoal">{{ blocks.preparation.description }}</p><ul class="mt-5 grid gap-3 text-charcoal"><li v-for="item in tutorial.materials" :key="item" class="flex gap-3"><span class="text-fire">●</span>{{ item }}</li></ul></aside>
      <div><p class="eyebrow">{{ blocks.steps.eyebrow }}</p><ol v-if="tutorial.steps.length" class="mt-6 grid gap-5"><li v-for="(step, index) in tutorial.steps" :key="`${step.title}-${index}`" class="paper-card grid gap-5 p-6 md:grid-cols-[4rem_1fr] md:p-8"><span class="font-serif text-4xl text-fire">{{ String(index + 1).padStart(2, '0') }}</span><div><ContentImage v-if="step.image" :image="step.image" :alt="step.imageAlt || step.title" sizes="(min-width: 768px) 70vw, 100vw" class="mb-5 aspect-[16/9] w-full rounded-2xl object-cover" /><h2 class="font-serif text-2xl font-semibold">{{ step.title }}</h2><p class="mt-3 leading-7 text-charcoal">{{ step.description }}</p></div></li></ol><div v-else class="mt-6 rounded-3xl border border-ink/10 bg-white p-8 text-center">教程步骤正在后台整理中。</div><div v-if="tutorial.notes.length" class="mt-10 rounded-[1.5rem] bg-[#eadbc8] p-7"><h2 class="font-serif text-2xl font-semibold">{{ blocks.notes.title }}</h2><ul class="mt-4 grid gap-2 text-charcoal"><li v-for="note in tutorial.notes" :key="note">· {{ note }}</li></ul></div></div>
    </section>
    <ContactPanel />
  </div>
</template>
