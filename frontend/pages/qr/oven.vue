<script setup lang="ts">
const progressUrl = 'http://122.51.118.103/oven/today'
const qrBasePath = '/images/oven-progress-qr-ip-v1'

useSeoMeta({
  title: '面包进度查询二维码｜李老汉窑烤面包',
  description: '扫码进入李老汉窑烤面包出炉进度查询页面。',
  robots: 'noindex,nofollow',
})
</script>

<template>
  <section class="min-h-[75vh] bg-flour py-10 sm:py-16">
    <div class="page-wrap">
      <div class="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_24px_70px_rgba(33,28,25,.12)] lg:grid-cols-[1fr_1.08fr]">
        <div class="grid place-items-center bg-[#ead8bd] p-7 sm:p-10">
          <img
            :src="`${qrBasePath}.svg`"
            :alt="`扫描进入面包出炉进度查询：${progressUrl}`"
            width="1000"
            height="1000"
            class="aspect-square w-full max-w-md rounded-[1.5rem] bg-[#fffaf2] shadow-sm"
          >
        </div>

        <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <p class="eyebrow text-fire">TODAY'S OVEN · 出炉进度</p>
          <h1 class="mt-4 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">扫码查询<br>我的面包进度</h1>
          <p class="mt-6 leading-8 text-charcoal">店员登记后，用微信扫描二维码，再输入登记手机号后四位，即可查看面包还有多久出炉。</p>
          <a :href="progressUrl" class="mt-4 break-all font-semibold text-fire underline decoration-fire/35 underline-offset-4">{{ progressUrl }}</a>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <a :href="`${qrBasePath}.png`" download="李老汉窑烤面包进度查询二维码-IP验收版.png" class="min-h-13 rounded-full bg-fire px-6 py-3 text-center font-semibold text-white transition hover:bg-[#bd4529] focus:outline-none focus:ring-2 focus:ring-fire focus:ring-offset-2">下载高清 PNG</a>
            <a :href="`${qrBasePath}.svg`" download="李老汉窑烤面包进度查询二维码-IP验收版.svg" class="min-h-13 rounded-full border border-ink/20 px-6 py-3 text-center font-semibold text-ink transition hover:border-fire hover:text-fire focus:outline-none focus:ring-2 focus:ring-fire focus:ring-offset-2">下载印刷 SVG</a>
          </div>

          <div class="mt-8 rounded-2xl border border-[#d3a37f]/45 bg-[#fff6e9] px-5 py-4 text-sm leading-7 text-charcoal">
            <b class="text-ink">桌牌建议</b>
            <p>可将此二维码放在收银台或取餐区。当前为 HTTP IP 验收版，正式印刷前建议更换为备案域名和 HTTPS 地址。</p>
          </div>

          <NuxtLink to="/qr/home" class="mt-6 w-fit text-sm font-semibold text-charcoal underline decoration-ink/20 underline-offset-4 hover:text-fire">查看官网主页二维码</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
