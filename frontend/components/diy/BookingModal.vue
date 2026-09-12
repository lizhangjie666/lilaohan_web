<script setup lang="ts">
import type { SiteSettings } from '~/types/content'

const props = defineProps<{ site?: SiteSettings | null }>()
const { isBookingOpen, closeBooking } = useBooking()
const closeButton = ref<HTMLButtonElement | null>(null)
const qrTrigger = ref<HTMLButtonElement | null>(null)
const qrCloseButton = ref<HTMLButtonElement | null>(null)
const isQrOpen = ref(false)
let returnFocus: HTMLElement | null = null

const hasWechat = computed(() => Boolean(props.site?.wechat || props.site?.wechatQr))

async function openQr() {
  isQrOpen.value = true
  await nextTick()
  qrCloseButton.value?.focus()
}

async function closeQr() {
  isQrOpen.value = false
  await nextTick()
  qrTrigger.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (isQrOpen.value) closeQr()
  else closeBooking()
}

watch(isBookingOpen, async (open) => {
  if (!import.meta.client) return
  if (open) {
    returnFocus = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    closeButton.value?.focus()
  } else {
    isQrOpen.value = false
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
    returnFocus?.focus()
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="booking-modal">
      <div v-if="isBookingOpen" class="fixed inset-0 z-[100] grid place-items-center bg-ink/75 p-4 backdrop-blur-sm" role="presentation" @mousedown.self="closeBooking">
        <section role="dialog" aria-modal="true" aria-labelledby="booking-title" class="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-[#fff8e9] p-6 shadow-2xl md:p-10">
          <button ref="closeButton" type="button" class="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-2xl transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire" aria-label="关闭预约窗口" @click="closeBooking">×</button>
          <p class="eyebrow text-fire">BOOK YOUR EXPERIENCE</p>
          <h2 id="booking-title" class="mt-3 pr-12 font-serif text-4xl font-semibold">预约窑烤面包 DIY</h2>
          <p class="mt-4 leading-8 text-charcoal">请添加门店微信，并说明希望体验的日期和人数。最终安排以门店微信回复为准。</p>

          <div v-if="site?.wechat" class="mt-7 rounded-2xl border border-ink/15 bg-white/70 px-5 py-4 text-center">
            <span class="block text-sm text-charcoal">门店微信号</span>
            <strong class="mt-1 block break-all text-lg">{{ site.wechat }}</strong>
          </div>
          <div v-if="site?.wechatQr" class="mt-6 rounded-3xl border border-ink/10 bg-white/70 p-5 text-center">
            <button ref="qrTrigger" type="button" class="group mx-auto block rounded-2xl p-2 transition hover:bg-fire/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire" aria-haspopup="dialog" aria-label="放大查看门店微信二维码" @click="openQr">
              <ContentImage :image="site.wechatQr" :alt="site.wechatQrAlt" sizes="220px" class="mx-auto h-auto max-h-56 w-auto max-w-full transition duration-300 group-hover:scale-[1.03]" />
            </button>
            <p class="mt-3 text-sm font-semibold text-charcoal">扫码添加门店微信预约</p>
            <p class="mt-1 text-xs text-charcoal/70">点击二维码可放大查看</p>
          </div>
          <div v-if="!hasWechat" class="mt-7 rounded-2xl border border-ink/15 bg-white/70 p-5 text-center">
            <p>门店微信暂未公布，当前无法在线预约。</p>
          </div>
        </section>

        <Transition name="booking-modal">
          <div v-if="isQrOpen && site?.wechatQr" class="fixed inset-0 z-[110] grid place-items-center bg-ink/90 p-4 backdrop-blur-md" @mousedown.self="closeQr">
            <section role="dialog" aria-modal="true" aria-labelledby="qr-title" class="relative w-full max-w-xl rounded-[2rem] bg-white p-5 text-center shadow-2xl md:p-8">
              <button ref="qrCloseButton" type="button" class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white text-2xl transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire" aria-label="关闭二维码大图" @click="closeQr">×</button>
              <h3 id="qr-title" class="sr-only">李老汉窑烤面包微信二维码大图</h3>
              <button type="button" class="block w-full cursor-zoom-out rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire" aria-label="关闭二维码大图" @click="closeQr">
                <ContentImage :image="site.wechatQr" :alt="site.wechatQrAlt" sizes="(min-width: 640px) 520px, 90vw" loading="eager" class="mx-auto max-h-[78vh] w-auto max-w-full rounded-xl object-contain" />
              </button>
              <p class="mt-4 font-semibold text-ink">扫码添加门店微信预约</p>
            </section>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.booking-modal-enter-active,.booking-modal-leave-active{transition:opacity .2s ease}.booking-modal-enter-from,.booking-modal-leave-to{opacity:0}
</style>
