<script setup lang="ts">
const { today, track } = useOven()
const { data: todayState } = await useAsyncData('today-oven-banner', today)
const batch = computed(() => todayState.value?.batch || null)

onMounted(() => { track('diy_view', batch.value?.batchNumber) })
</script>

<template>
  <section class="page-wrap pb-3 pt-8 md:pt-10" aria-labelledby="today-oven-title">
    <div class="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-flour shadow-[0_20px_60px_rgba(33,28,25,.16)] sm:px-9 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:py-10">
      <div class="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-fire/20 blur-3xl" aria-hidden="true" />
      <div class="relative">
        <p class="eyebrow text-[#ef9a78]">TODAY'S OVEN · 今日同炉</p>
        <h2 id="today-oven-title" class="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
          {{ batch ? `第 ${batch.batchNumber} 炉，等你一起。` : '新的窑火还没有升起。' }}
        </h2>
        <p class="mt-3 max-w-2xl leading-7 text-flour/70">
          {{ batch ? '给自己的面包取个名字，和今天同一炉的面包师一起等它出炉。' : '店员创建今天的炉次后，就可以上传作品、浏览同炉面包。' }}
        </p>
        <div v-if="batch" class="mt-4"><OvenStatusBadge :status="batch.status" /></div>
      </div>
      <div class="relative mt-7 flex flex-col gap-3 sm:flex-row md:mt-0 md:flex-col">
        <NuxtLink v-if="batch?.status === 'preparing'" to="/oven/today/join" class="btn-primary whitespace-nowrap">加入今日同炉</NuxtLink>
        <NuxtLink :to="batch ? `/oven/${batch.batchNumber}` : '/oven/today'" class="inline-flex min-h-12 items-center justify-center rounded-full border border-flour/30 px-6 py-3 font-semibold text-flour transition hover:bg-flour hover:text-ink">
          {{ batch ? '看看今日作品' : '查看今日同炉' }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
