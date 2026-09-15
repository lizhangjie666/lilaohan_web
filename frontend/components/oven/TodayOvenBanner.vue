<template>
  <section class="page-wrap pb-3 pt-8 md:pt-10" aria-labelledby="today-oven-title">
    <div class="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-flour shadow-[0_20px_60px_rgba(33,28,25,.16)] sm:px-9 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:py-10">
      <div class="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-fire/20 blur-3xl" aria-hidden="true" />
      <div class="relative">
        <p class="eyebrow text-[#ef9a78]">TODAY'S OVEN · 出炉进度</p>
        <h2 id="today-oven-title" class="mt-3 font-serif text-3xl font-semibold sm:text-4xl">你的面包，还有多久出炉？</h2>
        <p class="mt-3 max-w-2xl leading-7 text-flour/70">输入登记手机号的后四位，就能查看制作进度与面包照片。</p>
      </div>
      <NuxtLink to="/oven/today" class="relative mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-fire px-7 py-3 font-semibold text-white transition hover:bg-[#bd4529] md:mt-0">查询我的面包进度</NuxtLink>
    </div>
  </section>
</template>
