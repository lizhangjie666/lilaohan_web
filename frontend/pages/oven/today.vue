<script setup lang="ts">
const { today, track } = useOven()
const { data: todayState } = await useAsyncData('oven-today', today)
const batch = computed(() => todayState.value?.batch || null)

if (batch.value) {
  await navigateTo(`/oven/${batch.value.batchNumber}`, { redirectCode: 302, replace: true })
}

onMounted(() => { track('oven_wall_view') })

useSeoMeta({
  title: '今日同炉｜李老汉窑烤面包',
  description: '加入镇山村今天的一炉面包，记录自己的作品，也看看同炉面包师做出的不同模样。',
})
</script>

<template>
  <div class="min-h-[70vh] bg-flour">
    <section class="page-wrap flex min-h-[62vh] items-center py-16">
      <div class="mx-auto max-w-2xl text-center" v-reveal>
        <div class="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink text-4xl shadow-xl" aria-hidden="true">🔥</div>
        <p class="eyebrow mt-8">TODAY'S OVEN · 今日同炉</p>
        <h1 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-6xl">新的窑火还没有升起。</h1>
        <p class="mx-auto mt-6 max-w-xl text-base leading-8 text-charcoal md:text-lg">店员创建今天的炉次后，你就可以给面包取名字、上传入窑前照片，和大家一起等它出炉。</p>
        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <NuxtLink to="/diy" class="btn-primary">看看手作体验</NuxtLink>
          <NuxtLink to="/visit" class="btn-secondary">到店指南</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
