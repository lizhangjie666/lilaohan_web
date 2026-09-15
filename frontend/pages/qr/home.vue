<script setup lang="ts">
const siteUrl = 'http://122.51.118.103/'
const qrBasePath = '/images/homepage-qr-ip-v1'

useSeoMeta({
  title: '官网访问二维码｜李老汉窑烤面包',
  description: '李老汉窑烤面包官网 IP 验收版访问二维码下载页。',
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
            :alt="`扫描访问李老汉窑烤面包官网：${siteUrl}`"
            width="1000"
            height="1000"
            class="aspect-square w-full max-w-md rounded-[1.5rem] bg-[#fffaf2] shadow-sm"
          >
        </div>

        <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <p class="eyebrow text-fire">WECHAT SCAN · 微信扫码</p>
          <h1 class="mt-4 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">扫码访问<br>李老汉窑烤面包</h1>
          <p class="mt-6 leading-8 text-charcoal">用微信扫描左侧二维码，即可打开当前公网官网。二维码仅包含下方网址，不包含账号或个人信息。</p>
          <a :href="siteUrl" class="mt-4 break-all font-semibold text-fire underline decoration-fire/35 underline-offset-4">{{ siteUrl }}</a>

          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <a :href="`${qrBasePath}.png`" download="李老汉窑烤面包官网二维码-IP验收版.png" class="min-h-13 rounded-full bg-fire px-6 py-3 text-center font-semibold text-white transition hover:bg-[#bd4529] focus:outline-none focus:ring-2 focus:ring-fire focus:ring-offset-2">下载高清 PNG</a>
            <a :href="`${qrBasePath}.svg`" download="李老汉窑烤面包官网二维码-IP验收版.svg" class="min-h-13 rounded-full border border-ink/20 px-6 py-3 text-center font-semibold text-ink transition hover:border-fire hover:text-fire focus:outline-none focus:ring-2 focus:ring-fire focus:ring-offset-2">下载印刷 SVG</a>
          </div>

          <div class="mt-8 rounded-2xl border border-[#d3a37f]/45 bg-[#fff6e9] px-5 py-4 text-sm leading-7 text-charcoal">
            <b class="text-ink">IP 验收版本</b>
            <p>当前地址使用 HTTP，微信可能显示安全提示。正式制作长期桌牌前，请先绑定备案域名并启用 HTTPS，再重新生成二维码。</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
