<script setup lang="ts">
import type { ImageSource } from '~/types/content'

defineProps<{ image: ImageSource; alt: string }>()

const trigger = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
let previousOverflow = ''

async function open() {
  isOpen.value = true
  await nextTick()
  closeButton.value?.focus()
}

async function close() {
  isOpen.value = false
  await nextTick()
  trigger.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(isOpen, (open) => {
  if (!import.meta.client) return
  if (open) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
  } else {
    document.body.style.overflow = previousOverflow
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="mt-4">
    <button
      ref="trigger"
      type="button"
      class="group block rounded-xl bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire"
      aria-haspopup="dialog"
      aria-label="放大查看门店微信二维码"
      @click="open"
    >
      <ContentImage :image="image" :alt="alt" sizes="160px" class="aspect-square w-40 object-contain transition duration-300 group-hover:scale-[1.03]" />
    </button>
    <p class="mt-2 text-xs text-charcoal/70">点击二维码可放大查看</p>

    <Teleport to="body">
      <Transition name="qr-zoom">
        <div v-if="isOpen" class="fixed inset-0 z-[120] grid place-items-center bg-ink/90 p-4 backdrop-blur-md" @mousedown.self="close">
          <section role="dialog" aria-modal="true" aria-labelledby="visit-qr-title" class="relative w-full max-w-xl rounded-[2rem] bg-white p-5 text-center shadow-2xl md:p-8">
            <button
              ref="closeButton"
              type="button"
              class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-white text-2xl transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire"
              aria-label="关闭二维码大图"
              @click="close"
            >×</button>
            <h3 id="visit-qr-title" class="sr-only">李老汉窑烤面包微信二维码大图</h3>
            <button type="button" class="block w-full cursor-zoom-out rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fire" aria-label="关闭二维码大图" @click="close">
              <ContentImage :image="image" :alt="alt" sizes="(min-width: 640px) 520px, 90vw" loading="eager" class="mx-auto max-h-[78vh] w-auto max-w-full rounded-xl object-contain" />
            </button>
            <p class="mt-4 font-semibold text-ink">扫码添加门店微信</p>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.qr-zoom-enter-active,.qr-zoom-leave-active{transition:opacity .2s ease}.qr-zoom-enter-from,.qr-zoom-leave-to{opacity:0}
</style>
