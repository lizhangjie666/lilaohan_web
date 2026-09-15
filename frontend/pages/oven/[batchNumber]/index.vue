<script setup lang="ts">
const route = useRoute()
const { batch: getBatch, track } = useOven()
const batchNumber = computed(() => String(route.params.batchNumber || ''))
const { data: batch, error, refresh } = await useAsyncData(
  () => `oven-batch-${batchNumber.value}`,
  () => getBatch(batchNumber.value),
)
if (error.value) throw createError({ statusCode: 404, statusMessage: '没有找到这一炉' })

const submittedId = computed(() => String(route.query.submitted || ''))
const canJoin = computed(() => batch.value?.status === 'preparing')

function updateFire(documentId: string, fireCount: number) {
  const creation = batch.value?.creations.find(item => item.documentId === documentId)
  if (creation) creation.fireCount = fireCount
}

onMounted(() => { if (batch.value) track('oven_wall_view', batch.value.batchNumber) })

useSeoMeta({
  title: () => batch.value ? `第 ${batch.value.batchNumber} 炉 · 今日作品` : '今日同炉',
  description: '每一只面包，都有自己的样子。看看镇山村这一炉的面包作品，给喜欢的面包添一把柴。',
})
</script>

<template>
  <div v-if="batch" class="min-h-screen bg-flour">
    <section class="border-b border-ink/10 bg-[#ead8bd] py-10 md:py-16">
      <div class="page-wrap grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
        <div v-reveal>
          <p class="eyebrow">TODAY'S OVEN · 今日同炉</p>
          <h1 class="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-6xl">🔥 第 {{ batch.batchNumber }} 炉 · 今日作品</h1>
          <p class="mt-4 max-w-2xl text-base leading-8 text-charcoal md:text-lg">这一炉，我们一起等。每一只面包，都有自己的样子。</p>
          <div class="mt-5 flex flex-wrap items-center gap-3"><OvenStatusBadge :status="batch.status" /><span class="text-sm text-charcoal">{{ batch.batchDate }} · {{ batch.creations.length }} 只面包</span></div>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row md:flex-col">
          <NuxtLink v-if="canJoin" to="/oven/today/join" class="btn-primary">加入今日同炉</NuxtLink>
          <button type="button" class="btn-secondary" @click="refresh">刷新作品墙</button>
        </div>
      </div>
    </section>

    <section class="page-wrap py-10 md:py-16" aria-label="这一炉的面包作品">
      <div v-if="submittedId" class="mb-8 flex flex-col gap-4 rounded-3xl border border-fire/20 bg-fire/10 p-5 sm:flex-row sm:items-center sm:justify-between" role="status">
        <div><b class="font-serif text-xl">你的面包已经加入这一炉。</b><p class="mt-1 text-sm text-charcoal">原浏览器会保存作品凭证，出炉后可以回来补上传照片。</p></div>
        <NuxtLink :to="`/oven/${batch.batchNumber}/${submittedId}`" class="btn-primary shrink-0">查看我的面包</NuxtLink>
      </div>

      <div v-if="batch.creations.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <OvenBreadCreationCard
          v-for="creation in batch.creations"
          :key="creation.documentId"
          :creation="creation"
          :batch-number="batch.batchNumber"
          :status="batch.status"
          :highlighted="creation.documentId === submittedId"
          @fire="updateFire"
        />
      </div>
      <div v-else class="paper-card mx-auto max-w-2xl px-6 py-14 text-center">
        <span class="text-5xl" aria-hidden="true">🥖</span>
        <h2 class="mt-5 font-serif text-3xl font-semibold">这一炉还在等第一只面包。</h2>
        <p class="mt-4 leading-7 text-charcoal">给面包取个名字，把入窑前的模样留在这里。</p>
        <NuxtLink v-if="canJoin" to="/oven/today/join" class="btn-primary mt-7">成为第一位面包师</NuxtLink>
      </div>
    </section>
  </div>
</template>
