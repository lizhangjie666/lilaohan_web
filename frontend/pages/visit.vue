<script setup lang="ts">
import { mergePageSections } from '~/data/page-sections'

const { settings, faqs, pageSections } = useContent()
const [{ data: site }, { data: faqList }, { data: sectionList }] = await Promise.all([
  useAsyncData('visit-settings', settings),
  useAsyncData('visit-faqs', faqs),
  useAsyncData('visit-sections', () => pageSections('visit')),
])
const blocks = computed(() => mergePageSections(sectionList.value, ['visit.hero', 'visit.info', 'visit.contact', 'visit.faq']))
const config = useRuntimeConfig()
const phone = computed(() => String(config.public.phone || site.value?.phone || ''))
const wechat = computed(() => String(config.public.wechat || site.value?.wechat || ''))
const amap = computed(() => String(config.public.amapUrl || site.value?.amapUrl || ''))
useSeoMeta({ title: '到店指南', description: '查看李老汉窑烤面包的地址、营业时间、停车提示、地图导航与咨询方式。' })
</script>

<template>
  <div>
    <PageHero :eyebrow="blocks.hero.eyebrow" :title="blocks.hero.title" :description="blocks.hero.description" :image="blocks.hero.image" :image-alt="blocks.hero.imageAlt">
      <div class="flex flex-wrap gap-3"><a v-if="amap" :href="amap" class="btn-primary" target="_blank" rel="noopener">{{ blocks.hero.primaryButtonText }}</a><span v-else class="btn-primary cursor-not-allowed opacity-70">导航链接待确认</span><a v-if="phone" :href="`tel:${phone}`" class="btn-secondary">{{ blocks.hero.secondaryButtonText }}</a></div>
    </PageHero>
    <section class="page-wrap grid gap-8 py-16 md:grid-cols-2 md:py-24">
      <article class="paper-card p-7 md:p-10"><p class="eyebrow">{{ blocks.info.eyebrow }}</p><h2 class="mt-4 font-serif text-3xl font-semibold">{{ blocks.info.title }}</h2><p v-if="blocks.info.description" class="mt-4 leading-7 text-charcoal">{{ blocks.info.description }}</p><ContentImage v-if="blocks.info.image" :image="blocks.info.image" :alt="blocks.info.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" /><dl class="mt-7 grid gap-6"><div><dt class="text-sm font-semibold">地址</dt><dd class="mt-2 leading-7 text-charcoal">{{ site?.address }}</dd></div><div><dt class="text-sm font-semibold">营业时间</dt><dd class="mt-2 leading-7 text-charcoal">{{ site?.hours }}</dd></div><div><dt class="text-sm font-semibold">停车与进村</dt><dd class="mt-2 leading-7 text-charcoal">{{ site?.parking }}</dd></div><div><dt class="text-sm font-semibold">当前公告</dt><dd class="mt-2 leading-7 text-fire">{{ site?.notice }}</dd></div></dl></article>
      <article id="contact" class="paper-card p-7 md:p-10"><p class="eyebrow">{{ blocks.contact.eyebrow }}</p><h2 class="mt-4 font-serif text-3xl font-semibold">{{ blocks.contact.title }}</h2><p v-if="blocks.contact.description" class="mt-4 leading-7 text-charcoal">{{ blocks.contact.description }}</p><ContentImage v-if="blocks.contact.image" :image="blocks.contact.image" :alt="blocks.contact.imageAlt" sizes="(min-width: 768px) 50vw, 100vw" class="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" /><div class="mt-7 grid gap-4"><div class="rounded-2xl bg-ink/5 p-5"><p class="text-sm font-semibold">电话</p><a v-if="phone" :href="`tel:${phone}`" class="mt-2 block text-xl text-fire">{{ phone }}</a><p v-else class="mt-2 text-charcoal">待店主提供公开咨询电话</p></div><div id="wechat" class="rounded-2xl bg-ink/5 p-5"><p class="text-sm font-semibold">微信</p><p v-if="wechat" class="mt-2 text-xl text-fire">{{ wechat }}</p><p v-else class="mt-2 text-charcoal">待店主提供微信号与二维码</p><ContentImage v-if="site?.wechatQr" :image="site.wechatQr" :alt="site.wechatQrAlt" sizes="160px" class="mt-4 aspect-square w-40 rounded-xl bg-white object-contain p-2" /><div v-else class="mt-4 grid aspect-square w-40 place-items-center rounded-xl border border-dashed border-ink/25 bg-white text-center text-xs leading-5 text-charcoal">微信二维码<br>后台上传后显示</div></div></div></article>
    </section>
    <section class="bg-[#eadbc8] py-16 md:py-20"><div class="page-wrap"><p class="eyebrow">{{ blocks.faq.eyebrow }}</p><h2 class="section-title mt-4">{{ blocks.faq.title }}</h2><p v-if="blocks.faq.description" class="mt-6 max-w-3xl whitespace-pre-line rounded-[1.5rem] border border-fire/40 bg-flour/60 px-6 py-5 text-base leading-8 text-charcoal shadow-sm">{{ blocks.faq.description }}</p><div v-if="faqList?.length" class="mt-10 grid gap-4 md:grid-cols-3"><article v-for="item in faqList" :key="item.id" class="rounded-[1.5rem] bg-flour p-7"><h3 class="font-serif text-xl font-semibold">{{ item.question }}</h3><p class="mt-4 leading-7 text-charcoal">{{ item.answer }}</p></article></div></div></section>
  </div>
</template>
