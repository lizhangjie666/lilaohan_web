<script setup lang="ts">
import type { ImageSource } from '~/types/content'

const props = withDefaults(defineProps<{
  image: ImageSource
  alt?: string
  sizes?: string
  imageClass?: string
}>(), {
  alt: '',
  sizes: '100vw',
  imageClass: 'h-full w-full object-contain',
})

const original = computed(() => typeof props.image === 'string' ? props.image : props.image.original || props.image.src)
const trigger = ref<HTMLButtonElement | null>(null)
const saveLink = ref<HTMLAnchorElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const open = ref(false)
let previousOverflow = ''

function close() {
  open.value = false
  nextTick(() => trigger.value?.focus())
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === saveLink.value) {
      event.preventDefault()
      closeButton.value?.focus()
    } else if (!event.shiftKey && document.activeElement === closeButton.value) {
      event.preventDefault()
      saveLink.value?.focus()
    }
  }
}

watch(open, async (value) => {
  if (!import.meta.client) return
  if (value) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    closeButton.value?.focus()
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
  <div>
    <button ref="trigger" type="button" class="group relative block h-full w-full overflow-hidden rounded-2xl bg-[#eadbc7] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire" :aria-label="`放大查看${alt || '图片'}`" aria-haspopup="dialog" @click="open = true">
      <ContentImage :image="image" :alt="alt" :sizes="sizes" class="block w-full transition duration-300 group-hover:scale-[1.015]" :class="imageClass" />
      <span class="absolute bottom-2 right-2 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">点击放大 ↗</span>
    </button>
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[130] flex flex-col bg-ink/95 p-3 text-white sm:p-6" @mousedown.self="close">
        <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 pb-3">
          <p class="truncate text-sm">{{ alt || '查看图片' }}</p>
          <div class="flex shrink-0 gap-2">
            <a ref="saveLink" :href="original" :download="original.split('/').pop() || '图片'" target="_blank" rel="noopener noreferrer" class="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">保存原图</a>
            <button ref="closeButton" type="button" class="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" aria-label="关闭图片大图" @click="close">关闭 ×</button>
          </div>
        </div>
        <div role="dialog" aria-modal="true" :aria-label="alt || '图片大图'" class="flex min-h-0 flex-1 items-center justify-center" @mousedown.self="close">
          <img :src="original" :alt="alt" class="max-h-full max-w-full object-contain" decoding="async">
        </div>
      </div>
    </Teleport>
  </div>
</template>
