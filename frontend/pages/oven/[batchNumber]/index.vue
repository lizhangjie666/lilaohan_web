<script setup lang="ts">
const route = useRoute()
const { batch: getBatch, track } = useOven()
const batchNumber = computed(() => String(route.params.batchNumber || ''))
const { data: batch, error, refresh } = await useAsyncData(
  () => `oven-batch-${batchNumber.value}`,
  () => getBatch(batchNumber.value),
)
if (error.value) throw createError({ statusCode: 404, statusMessage: '没有找到这一炉' })

onMounted(() => { if (batch.value) track('oven_wall_view', batch.value.batchNumber) })

useSeoMeta({
  title: () => batch.value ? `第 ${batch.value.batchNumber} 炉 · 今日作品` : '今日同炉',
  description: '李老汉窑烤面包今日同炉历史作品。',
})
</script>

<template>
  <div v-if="batch" class="min-h-screen bg-flour">
    <section class="border-b border-ink/10 bg-[#ead8bd] py-10 md:py-16">
      <div class="page-wrap grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
        <div v-reveal>
          <p class="eyebrow">TODAY'S OVEN · 今日同炉</p>
          <h1 class="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-6xl">🔥 第 {{ batch.batchNumber }} 炉 · 今日作品</h1>
          <p class="mt-4 max-w-2xl text-base leading-8 text-charcoal md:text-lg">这是旧版今日同炉留下的历史作品，现已停止投稿和互动。</p>
          <div class="mt-5 flex flex-wrap items-center gap-3"><OvenStatusBadge :status="batch.status" /><span class="text-sm text-charcoal">{{ batch.batchDate }} · {{ batch.creations.length }} 只面包</span></div>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink to="/oven/today" class="btn-primary">查询现在的出炉进度</NuxtLink>
          <button type="button" class="btn-secondary" @click="refresh">刷新作品墙</button>
        </div>
      </div>
    </section>

    <section class="page-wrap py-10 md:py-16" aria-label="这一炉的面包作品">
      <div v-if="batch.creations.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <OvenBreadCreationCard
          v-for="creation in batch.creations"
          :key="creation.documentId"
          :creation="creation"
          :batch-number="batch.batchNumber"
          :status="batch.status"
          readonly
        />
      </div>
      <div v-else class="paper-card mx-auto max-w-2xl px-6 py-14 text-center">
        <span class="text-5xl" aria-hidden="true">🥖</span>
        <h2 class="mt-5 font-serif text-3xl font-semibold">这一炉没有保留作品。</h2>
        <p class="mt-4 leading-7 text-charcoal">新版出炉进度不会公开展示其他顾客的信息。</p>
      </div>
    </section>
  </div>
</template>
