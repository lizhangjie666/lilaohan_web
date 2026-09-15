<script setup lang="ts">
import type { OvenOrderPublic } from '~/types/oven'

const { lookupOrder } = useOven()
const phoneLast4 = ref('')
const order = ref<OvenOrderPublic | null>(null)
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  if (loading.value) return
  errorMessage.value = ''
  order.value = null
  const last4 = phoneLast4.value.replace(/\D/g, '').slice(-4)
  if (last4.length !== 4) {
    errorMessage.value = '请输入手机号码后四位。'
    return
  }
  loading.value = true
  try { order.value = await lookupOrder(last4) }
  catch (error: any) { errorMessage.value = error.message }
  finally { loading.value = false }
}

useSeoMeta({
  title: '查询我的面包进度｜李老汉窑烤面包',
  description: '输入登记手机号的后四位，查询镇山村窑烤面包的制作与出炉进度。',
  robots: 'noindex,follow',
})
</script>

<template>
  <main class="min-h-[75vh] bg-flour py-10 sm:py-16">
    <div class="page-wrap grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
      <section class="overflow-hidden rounded-[2rem] bg-ink p-7 text-flour shadow-[0_24px_70px_rgba(33,28,25,.16)] sm:p-10" v-reveal>
        <p class="eyebrow text-[#ef9a78]">TODAY'S OVEN · 出炉进度</p>
        <h1 class="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-6xl">这一炉，<br>我们一起等。</h1>
        <p class="mt-6 max-w-xl leading-8 text-flour/70">店员接收面包并登记手机号后，输入手机号码后四位，即可查看还有多久出炉。</p>
        <form class="mt-8 grid gap-5" @submit.prevent="submit">
          <label class="grid gap-2 font-semibold">手机号后四位
            <input v-model="phoneLast4" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="例如：3452" class="min-h-14 rounded-2xl border border-white/20 bg-white/10 px-4 text-lg text-white outline-none placeholder:text-white/35 focus:border-fire focus:ring-2 focus:ring-fire/25">
          </label>
          <button type="submit" class="mt-1 min-h-14 rounded-full bg-fire px-7 font-semibold text-white transition hover:bg-[#bd4529] disabled:opacity-60" :disabled="loading">{{ loading ? '查询中…' : '查询我的面包' }}</button>
          <p v-if="errorMessage" class="rounded-2xl border border-[#ef9a78]/30 bg-[#ef9a78]/10 px-4 py-3 text-sm leading-6 text-[#ffd5c5]" role="alert">{{ errorMessage }}</p>
        </form>
        <p class="mt-6 text-xs leading-6 text-flour/45">为保护隐私，页面不会公开展示顾客名单，也不会在网址中记录你的手机号。若尾号重复，请联系店员处理。</p>
      </section>

      <section v-if="order" class="grid gap-6" v-reveal="100">
        <OvenOrderProgress :order="order" />
        <div class="grid gap-5 sm:grid-cols-2">
          <figure class="paper-card overflow-hidden">
            <ContentImage v-if="order.beforeImage" :image="order.beforeImage" :alt="`${order.customerName}的面包入炉前照片`" sizes="(min-width:640px) 50vw, 100vw" class="aspect-[4/3] w-full object-cover" />
            <div v-else class="grid aspect-[4/3] place-items-center bg-[#ead8bd] px-6 text-center text-charcoal"><p><span class="block text-4xl">🥖</span><b class="mt-3 block">店员稍后补充照片</b></p></div>
            <figcaption class="p-5 font-serif text-xl font-semibold">入炉前</figcaption>
          </figure>
          <figure class="paper-card overflow-hidden">
            <ContentImage v-if="order.afterImage" :image="order.afterImage" :alt="`${order.customerName}的面包出炉后照片`" sizes="(min-width:640px) 50vw, 100vw" class="aspect-[4/3] w-full object-cover" />
            <div v-else class="grid aspect-[4/3] place-items-center bg-[#d9c29f] px-6 text-center text-charcoal"><p><span class="block text-4xl">🔥</span><b class="mt-3 block">等待出炉后的模样</b></p></div>
            <figcaption class="p-5 font-serif text-xl font-semibold">出炉后</figcaption>
          </figure>
        </div>
      </section>

      <section v-else class="paper-card grid min-h-[28rem] place-items-center p-8 text-center" v-reveal="100">
        <div><span class="text-6xl" aria-hidden="true">🔥</span><h2 class="mt-5 font-serif text-3xl font-semibold">输入手机尾号后查看</h2><p class="mx-auto mt-4 max-w-md leading-7 text-charcoal">进度条会随时间向前移动，到点后自动提示“可以取啦”。实际领取时请向店员确认姓名。</p></div>
      </section>
    </div>
  </main>
</template>
