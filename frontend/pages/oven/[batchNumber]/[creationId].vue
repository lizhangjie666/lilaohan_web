<script setup lang="ts">
const route = useRoute()
const { creation: getCreation } = useOven()
const creationId = computed(() => String(route.params.creationId || ''))
const routeBatch = computed(() => String(route.params.batchNumber || '').padStart(3, '0'))
const { data: creation, error } = await useAsyncData(
  () => `oven-creation-${creationId.value}`,
  () => getCreation(creationId.value),
)
if (error.value || (creation.value && creation.value.batch.batchNumber !== routeBatch.value)) {
  throw createError({ statusCode: 404, statusMessage: '没有找到这个面包档案' })
}

const formattedDate = computed(() => {
  const value = creation.value?.batch.batchDate
  if (!value) return ''
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
})

useSeoMeta({
  title: () => creation.value ? `第 ${creation.value.batch.batchNumber} 炉 · ${creation.value.breadName}` : '我的镇山面包档案',
  description: () => creation.value ? `${creation.value.nickname}在贵阳镇山村制作的“${creation.value.breadName}”窑烤面包档案。` : '',
})

</script>

<template>
  <div v-if="creation" class="min-h-screen bg-flour">
    <section class="page-wrap py-8 md:py-14">
      <NuxtLink :to="`/oven/${creation.batch.batchNumber}`" class="text-sm font-semibold text-fire hover:underline">← 返回第 {{ creation.batch.batchNumber }} 炉</NuxtLink>

      <div class="mt-7 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div class="overflow-hidden rounded-[2rem] bg-[#dec8a5] shadow-[0_24px_70px_rgba(33,28,25,.13)]" v-reveal>
          <ContentImage
            v-if="creation.beforeImage"
            :image="creation.beforeImage"
            :alt="creation.beforeImage.alt || `${creation.breadName}入窑前照片`"
            sizes="(min-width: 1024px) 58vw, 100vw"
            class="aspect-[4/3] h-full w-full object-cover"
            loading="eager"
          />
        </div>

        <div class="lg:sticky lg:top-28" v-reveal="100">
          <div class="flex flex-wrap items-center gap-3"><span class="eyebrow">第 {{ creation.batch.batchNumber }} 炉</span><OvenStatusBadge :status="creation.batch.status" /></div>
          <h1 class="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">《{{ creation.breadName }}》</h1>
          <p class="mt-4 text-lg text-charcoal">面包师：{{ creation.nickname }}</p>
          <p class="mt-6 font-serif text-3xl font-semibold text-fire">🔥 {{ creation.fireCount }} 把柴</p>
          <p class="mt-5 rounded-2xl bg-fire/10 px-4 py-3 text-sm leading-6 text-charcoal">旧版互动数据已归档，本页面仅供历史查看。</p>

          <dl class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10">
            <div class="bg-[#fbf5ec] p-5"><dt class="text-xs tracking-[.15em] text-charcoal">出生于</dt><dd class="mt-2 font-semibold">贵州 · 贵阳 · 镇山村</dd></div>
            <div class="bg-[#fbf5ec] p-5"><dt class="text-xs tracking-[.15em] text-charcoal">制作日期</dt><dd class="mt-2 font-semibold">{{ formattedDate }}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="border-y border-ink/10 bg-[#ead8bd] py-12 md:py-20">
      <div class="page-wrap">
        <div class="mb-8 max-w-2xl">
          <p class="eyebrow">BEFORE · AFTER</p>
          <h2 class="mt-3 section-title">我的镇山面包档案</h2>
          <p class="mt-4 body-copy">从刚捏好的模样，到带着窑火香气出炉。今天，它出生在镇山村。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <figure class="paper-card overflow-hidden">
            <ZoomableContentImage v-if="creation.beforeImage" :image="creation.beforeImage" :alt="`${creation.breadName}入窑前`" sizes="(min-width: 768px) 50vw, 100vw" image-class="aspect-[4/3] w-full object-contain" />
            <figcaption class="p-5 font-serif text-xl font-semibold">入窑前</figcaption>
          </figure>
          <figure class="paper-card overflow-hidden">
            <ZoomableContentImage v-if="creation.afterImage" :image="creation.afterImage" :alt="`${creation.breadName}出炉后`" sizes="(min-width: 768px) 50vw, 100vw" image-class="aspect-[4/3] w-full object-contain" />
            <div v-else class="grid aspect-[4/3] place-items-center bg-[#d6bd94] px-6 text-center text-charcoal"><p><span class="block text-4xl" aria-hidden="true">🔥</span><b class="mt-3 block font-serif text-2xl">还在等出炉后的模样</b></p></div>
            <figcaption class="p-5 font-serif text-xl font-semibold">出炉后</figcaption>
          </figure>
        </div>

        <p v-if="!creation.afterImage" class="mt-6 rounded-2xl bg-white/50 p-4 text-sm leading-6 text-charcoal">这是旧版今日同炉的只读历史档案，不再接受照片补传。</p>
      </div>
    </section>
  </div>
</template>
