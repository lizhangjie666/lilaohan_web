<script setup lang="ts">
const { settings } = useContent()
const { data } = await useAsyncData('site-settings', settings)
const config = useRuntimeConfig()
const current = computed(() => ({ ...data.value, phone: config.public.phone || data.value?.phone, wechat: config.public.wechat || data.value?.wechat, amapUrl: config.public.amapUrl || data.value?.amapUrl }))
</script>

<template>
  <section class="bg-fire py-14 text-white md:py-20">
    <div class="page-wrap grid items-end gap-10 md:grid-cols-[1.5fr_1fr]">
      <div><p class="text-xs font-semibold tracking-[0.2em] text-white/65">PLAN YOUR VISIT</p><h2 class="mt-4 font-serif text-4xl font-semibold md:text-6xl">火已经生起，等你进村。</h2><p class="mt-5 max-w-2xl leading-8 text-white/75">{{ current.address }}<br>{{ current.hours }} · {{ current.parking }}</p></div>
      <div class="flex flex-wrap gap-3 md:justify-end"><a v-if="current.amapUrl" :href="current.amapUrl" class="btn-secondary border-white/30 bg-white text-ink" target="_blank" rel="noopener">一键导航</a><NuxtLink v-else to="/visit" class="btn-secondary border-white/30 bg-white text-ink">查看到店信息</NuxtLink><a v-if="current.phone" :href="`tel:${current.phone}`" class="btn-secondary border-white/30 bg-transparent text-white">电话咨询</a><NuxtLink v-else to="/visit#contact" class="btn-secondary border-white/30 bg-transparent text-white">联系方式待确认</NuxtLink></div>
    </div>
  </section>
</template>
