<script setup lang="ts">
const { products, tutorials, spots, settings } = useContent()
const [{ data: productList }, { data: tutorialList }, { data: spotList }, { data: site }] = await Promise.all([
  useAsyncData('home-products', products), useAsyncData('home-tutorials', tutorials), useAsyncData('home-spots', spots), useAsyncData('home-settings', settings),
])
const featured = computed(() => productList.value?.filter(item => item.featured).slice(0, 3) || [])

useSeoMeta({ title: '镇山村里的窑火与手作', description: '在贵阳花溪镇山村，等一炉面包慢慢出炉。发现窑烤菜单、手作DIY和村落打卡路线。' })
useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Bakery', name: '李老汉窑烤面包', address: { '@type': 'PostalAddress', addressLocality: '贵阳市花溪区', streetAddress: site.value?.address, addressCountry: 'CN' }, telephone: site.value?.phone || undefined }) }] })
</script>

<template>
  <div>
    <section class="relative isolate min-h-[82vh] overflow-hidden bg-ink text-white">
      <img :src="site?.heroImage" :alt="site?.heroImageAlt" class="absolute inset-0 -z-20 h-full w-full object-cover object-[55%_48%]" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
      <div class="page-wrap flex min-h-[82vh] items-end py-16 md:py-24">
        <div class="max-w-3xl"><p class="text-xs font-semibold tracking-[0.24em] text-[#ff9b78]">GUIYANG · ZHENSHAN VILLAGE</p><h1 class="mt-6 font-serif text-5xl font-semibold leading-[1.08] md:text-7xl lg:text-[5.6rem]">{{ site?.heroTitle }}</h1><p class="mt-7 max-w-xl text-base leading-8 text-white/75 md:text-lg">{{ site?.heroIntro }}</p><div class="mt-9 flex flex-wrap gap-3"><NuxtLink to="/menu" class="btn-primary">看看今天吃什么</NuxtLink><NuxtLink to="/visit" class="btn-secondary border-white/30 bg-white/10 text-white backdrop-blur">导航到店</NuxtLink></div></div>
      </div>
    </section>

    <section class="page-wrap py-20 md:py-32">
      <div class="grid items-center gap-12 md:grid-cols-2"><div class="relative"><div class="aspect-[4/5] overflow-hidden rounded-[2rem]"><img :src="site?.homeFireImage" :alt="site?.homeFireImageAlt" class="image-cover" loading="lazy"></div><span class="absolute -bottom-5 -right-2 grid h-28 w-28 rotate-6 place-items-center rounded-full bg-fire px-4 text-center font-serif text-lg text-white md:right-8">一炉火<br>一整天</span></div><div><p class="eyebrow">01 · 看见一炉火</p><h2 class="section-title mt-5">不是追求快，<br>是把火候交给时间。</h2><p class="body-copy mt-7">添柴、看火、等待。窑炉里的高温让面包和披萨长出微焦的边，也让每一次出炉都有一点不同。我们把制作过程留在你看得见的地方。</p><NuxtLink to="/story" class="mt-8 inline-block border-b border-ink pb-1 font-semibold">认识我们的窑炉 →</NuxtLink></div></div>
    </section>

    <section class="bg-ink py-20 text-flour md:py-28">
      <div class="page-wrap"><div class="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p class="eyebrow">02 · 刚出炉的味道</p><h2 class="section-title mt-5">今天，想从哪一口开始？</h2></div><NuxtLink to="/menu" class="text-sm font-semibold text-[#ff9b78]">查看完整窑烤菜单 →</NuxtLink></div><div class="mt-12 grid gap-6 md:grid-cols-3"><ProductCard v-for="item in featured" :key="item.id" :product="item" class="!border-white/10 !bg-[#2c2521] !text-flour [&_p]:!text-flour/65" /></div></div>
    </section>

    <section class="page-wrap py-20 md:py-32">
      <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div class="lg:sticky lg:top-28 lg:self-start"><p class="eyebrow">03 · 亲手做一次</p><h2 class="section-title mt-5">把“我来过”<br>变成“我做过”。</h2><p class="body-copy mt-6">揉面、铺料、等待出炉。手作体验不是观看节目，而是一起完成一份可以吃掉的旅行记忆。</p><NuxtLink to="/diy" class="btn-primary mt-8">查看手作教程</NuxtLink></div><div class="grid gap-6 md:grid-cols-2"><NuxtLink v-for="item in tutorialList" :key="item.id" :to="`/diy/${item.slug}`" class="paper-card group overflow-hidden"><div class="aspect-[4/5] overflow-hidden"><img :src="item.image" :alt="item.imageAlt" class="image-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy"></div><div class="p-6"><p class="eyebrow">{{ item.type }}</p><h3 class="mt-3 font-serif text-2xl font-semibold">{{ item.title }}</h3><p class="mt-4 leading-7 text-charcoal">{{ item.summary }}</p></div></NuxtLink></div></div>
    </section>

    <section class="bg-lake py-20 text-white md:py-28">
      <div class="page-wrap"><div class="grid gap-8 md:grid-cols-[1fr_1.2fr]"><div><p class="text-xs font-semibold tracking-[0.2em] text-white/60">04 · WALK INTO THE VILLAGE</p><h2 class="section-title mt-5">从店里出发，<br>走进镇山村。</h2><p class="mt-6 max-w-lg leading-8 text-white/70">把等面包出炉的时间，留给湖边、石板路和村子的风。所有机位将在店主实地核实后正式发布。</p><NuxtLink to="/guide" class="mt-8 inline-block border-b border-white pb-1 font-semibold">打开半日打卡指南 →</NuxtLink></div><div class="grid gap-4 sm:grid-cols-3"><article v-for="(spot, index) in spotList" :key="spot.id" class="overflow-hidden rounded-[1.5rem] bg-white/10"><div class="aspect-square overflow-hidden"><img :src="spot.image" :alt="spot.imageAlt" class="image-cover" loading="lazy"></div><div class="p-5"><span class="text-xs text-white/55">0{{ index + 1 }}</span><h3 class="mt-2 font-serif text-xl">{{ spot.name }}</h3></div></article></div></div></div>
    </section>

    <ContactPanel />
  </div>
</template>
