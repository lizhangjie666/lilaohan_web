<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const route = useRoute()
const { tutorials, pageSections, settings } = useContent()
const [{ data: list }, { data: sectionList }, { data: site }] = await Promise.all([
  useAsyncData(`tutorial-${String(route.params.slug)}`, tutorials),
  useAsyncData('diy-detail-sections', () => pageSections('diy-detail')),
  useAsyncData('diy-tutorial-settings', settings),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['diy-detail.preparation', 'diy-detail.steps', 'diy-detail.notes']))
const tutorial = computed(() => list.value?.find(item => item.slug === route.params.slug))
if (!tutorial.value) throw createError({ statusCode: 404, statusMessage: '没有找到这份教程' })
const hasChapters = computed(() => (tutorial.value?.tutorialChapters.length || 0) > 0)
if (tutorial.value.experienceStatus === '内容筹备中' || (!tutorial.value.steps.length && !tutorial.value.tutorialChapters.length)) {
  throw createError({ statusCode: 404, statusMessage: '教程尚未发布' })
}

const structuredData = computed(() => {
  if (!hasChapters.value) return {
    '@context': 'https://schema.org', '@type': 'HowTo', name: `${tutorial.value?.title}教程`, description: tutorial.value?.summary,
    step: tutorial.value?.steps.map(step => ({ '@type': 'HowToStep', name: step.title, text: step.description })),
  }
  const shaping = tutorial.value?.tutorialChapters.find(chapter => chapter.anchor === 'shaping')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: `${tutorial.value?.title}教程`, description: tutorial.value?.summary, articleSection: tutorial.value?.tutorialChapters.map(chapter => chapter.title) },
      ...(shaping?.lessons.filter(lesson => lesson.steps.length).map(lesson => ({ '@type': 'HowTo', name: `${lesson.title}面包造型教学`, description: lesson.description, step: lesson.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step, text: step })) })) || []),
    ],
  }
})
useSeoMeta({ title: () => `${tutorial.value?.title || '手作体验'}教程`, description: () => tutorial.value?.summary })
useHead({ script: [{ type: 'application/ld+json', innerHTML: computed(() => JSON.stringify(structuredData.value)) }] })
const { handleBooking } = useBooking()
</script>

<template>
  <div v-if="tutorial" class="bg-[#fff8e9] text-[#37271f]">
    <section class="bg-ink py-16 text-flour md:py-24"><div class="page-wrap">
      <div class="flex flex-wrap gap-5 text-sm font-semibold text-[#ff9b78]"><NuxtLink to="/diy">← 全部体验</NuxtLink><NuxtLink :to="`/diy/${tutorial.slug}`">查看项目介绍</NuxtLink></div>
      <div class="mt-8 grid items-end gap-10 md:grid-cols-2"><div><p class="eyebrow">{{ tutorial.type }} · 教程</p><h1 class="display-title mt-5">{{ hasChapters ? '从认识窑炉，到做出自己的面包。' : tutorial.title }}</h1><p class="mt-7 text-lg leading-8 text-flour/65">{{ tutorial.summary }}</p><a v-if="tutorial.videoUrl" :href="tutorial.videoUrl" class="btn-primary mt-7" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> {{ tutorial.videoLabel || '观看演示视频' }}</a></div><div class="aspect-[4/3] overflow-hidden rounded-[2rem]"><ContentImage v-if="tutorial.image" :image="tutorial.image" :alt="tutorial.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="image-cover" loading="eager" /><div v-else class="grid h-full place-items-center bg-[radial-gradient(circle_at_70%_30%,#74412c,#33251f)] text-flour/60">教程封面待上传</div></div></div>
    </div></section>

    <template v-if="hasChapters">
      <nav aria-label="教程章节" class="sticky top-0 z-20 border-b border-ink/10 bg-[#fff8e9]/95 py-3 backdrop-blur"><div class="page-wrap flex gap-2 overflow-x-auto">
        <a v-for="(chapter, index) in tutorial.tutorialChapters" :key="chapter.anchor" :href="`#${chapter.anchor}`" class="shrink-0 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold transition hover:border-fire hover:text-fire focus-visible:outline focus-visible:outline-2 focus-visible:outline-fire">0{{ index + 1 }} {{ chapter.title }}</a>
      </div></nav>
      <section v-for="(chapter, chapterIndex) in tutorial.tutorialChapters" :id="chapter.anchor" :key="chapter.anchor" class="scroll-mt-24 py-16 md:py-24" :class="chapter.anchor === 'oven' ? 'bg-[#2c241f] text-flour' : chapter.anchor === 'tools' ? 'bg-[#ead7b8]' : 'bg-[#fff8e9]'">
        <div class="page-wrap"><div class="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div><p class="eyebrow" :class="chapter.anchor === 'oven' ? 'text-[#f39a72]' : 'text-fire'">{{ chapter.eyebrow }}</p><p class="mt-5 font-serif text-7xl opacity-15">0{{ chapterIndex + 1 }}</p></div><div><h2 class="font-serif text-4xl font-semibold leading-tight md:text-6xl">{{ chapter.title }}</h2><p class="mt-5 max-w-3xl text-lg leading-9" :class="chapter.anchor === 'oven' ? 'text-flour/65' : 'text-charcoal'">{{ chapter.summary }}</p></div></div>
          <div class="mt-12 grid gap-5" :class="chapter.anchor === 'shaping' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'">
            <article v-for="(lesson, lessonIndex) in chapter.lessons" :key="`${chapter.anchor}-${lesson.title}`" class="overflow-hidden rounded-[2rem] border p-6 md:p-8" :class="chapter.anchor === 'oven' ? 'border-white/10 bg-white/[.055]' : 'border-ink/10 bg-white'">
              <ZoomableContentImage v-if="lesson.image" :image="lesson.image" :alt="lesson.imageAlt || lesson.title" sizes="(min-width: 1280px) 30vw, (min-width:768px) 50vw, 100vw" image-class="max-h-[30rem] w-full object-contain" class="mb-7" />
              <div v-else class="mb-7 grid aspect-[4/3] place-items-center rounded-2xl" :class="chapter.anchor === 'oven' ? 'bg-[radial-gradient(circle_at_65%_35%,#8a472f,#342721)] text-flour/55' : 'bg-[linear-gradient(145deg,#f1ddba,#d8b98c)] text-ink/40'"><span class="font-serif text-6xl">{{ String(lessonIndex + 1).padStart(2, '0') }}</span></div>
              <h3 class="font-serif text-2xl font-semibold md:text-3xl">{{ lesson.title }}</h3><p class="mt-4 leading-8" :class="chapter.anchor === 'oven' ? 'text-flour/65' : 'text-charcoal'">{{ lesson.description }}</p>
              <ol v-if="lesson.steps.length" class="mt-6 grid gap-3"><li v-for="(step, index) in lesson.steps" :key="step" class="flex gap-3 leading-7"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fire text-xs font-bold text-white">{{ index + 1 }}</span><span>{{ step }}</span></li></ol>
              <p v-if="lesson.safetyNote" class="mt-6 rounded-xl border border-fire/30 bg-fire/10 px-4 py-3 text-sm font-semibold leading-6" :class="chapter.anchor === 'oven' ? 'text-[#ffc3aa]' : 'text-[#8f371f]'">{{ lesson.safetyNote }}</p>
            </article>
          </div>
          <p v-if="chapter.anchor === 'oven'" class="mt-8 text-sm text-flour/50">窑炉术语参考：<a href="https://www.mha-net.org/docs/admin/BakeOvenPort.pdf" target="_blank" rel="noopener noreferrer" class="underline decoration-white/30 underline-offset-4 hover:text-white">Masonry Heater Association 烘焙窑炉资料</a>。本页仅作通用科普，不用于判断门店窑炉类型。</p>
        </div>
      </section>
    </template>

    <section v-else class="page-wrap grid gap-12 py-16 md:grid-cols-[.7fr_1.3fr] md:py-24"><aside><p class="eyebrow">{{ blocks.preparation.eyebrow }}</p><p class="mt-4 text-charcoal">{{ blocks.preparation.description }}</p><ul class="mt-5 grid gap-3 text-charcoal"><li v-for="item in tutorial.materials" :key="item" class="flex gap-3"><span class="text-fire">●</span>{{ item }}</li></ul></aside><div><p class="eyebrow">{{ blocks.steps.eyebrow }}</p><ol class="mt-6 grid gap-5"><li v-for="(step, index) in tutorial.steps" :key="`${step.title}-${index}`" class="paper-card grid gap-5 p-6 md:grid-cols-[4rem_1fr] md:p-8"><span class="font-serif text-4xl text-fire">{{ String(index + 1).padStart(2, '0') }}</span><div><ZoomableContentImage v-if="step.image" :image="step.image" :alt="step.imageAlt || step.title" sizes="(min-width:768px) 70vw, 100vw" image-class="max-h-[38rem] w-full object-contain" class="mb-5" /><h2 class="font-serif text-2xl font-semibold">{{ step.title }}</h2><p class="mt-3 leading-7 text-charcoal">{{ step.description }}</p></div></li></ol></div></section>
    <section v-if="tutorial.notes.length" class="page-wrap pb-16"><div class="rounded-[1.5rem] bg-[#eadbc8] p-7"><h2 class="font-serif text-2xl font-semibold">{{ blocks.notes.title }}</h2><ul class="mt-4 grid gap-2 text-charcoal"><li v-for="note in tutorial.notes" :key="note">· {{ note }}</li></ul></div></section>
    <section class="page-wrap pb-16 md:pb-24"><div class="rounded-[2.5rem] bg-ink px-7 py-14 text-center text-white md:px-14 md:py-20"><p class="eyebrow text-[#f1a17b]">BOOK YOUR EXPERIENCE</p><h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">看完教程，来亲手做一次。</h2><p class="mx-auto mt-5 max-w-2xl leading-8 text-white/65">体验安排请通过门店微信确认。</p><button type="button" class="mt-8 rounded-full bg-fire px-7 py-4 font-semibold" @click="handleBooking">添加微信预约</button></div></section>
    <DiyBookingModal :site="site" :experience-name="tutorial.title" />
    <DiyMobileBookingBar />
  </div>
</template>
