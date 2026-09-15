<script setup lang="ts">
import { ovenOrderStatusLabels, type OvenOrderPublic } from '~/types/oven'

const props = defineProps<{ order: OvenOrderPublic }>()
const now = ref(Date.now())
const serverOffset = new Date(props.order.serverTime).getTime() - Date.now()
let timer: ReturnType<typeof setInterval> | undefined

const status = computed(() => {
  if (props.order.status === 'processing' && new Date(props.order.estimatedReadyAt).getTime() <= now.value) return 'ready'
  return props.order.status
})
const percent = computed(() => {
  if (status.value === 'ready' || status.value === 'collected') return 100
  if (status.value === 'cancelled') return 0
  const start = new Date(props.order.startedAt).getTime()
  const end = new Date(props.order.estimatedReadyAt).getTime()
  return Math.max(0, Math.min(100, ((now.value - start) / Math.max(1, end - start)) * 100))
})
const remainingText = computed(() => {
  if (status.value === 'ready') return '可以取啦'
  if (status.value === 'collected') return '已领取'
  if (status.value === 'cancelled') return '已取消'
  const minutes = Math.ceil(Math.max(0, new Date(props.order.estimatedReadyAt).getTime() - now.value) / 60000)
  return minutes > 1 ? `还需约 ${minutes} 分钟` : '不到 1 分钟'
})
const readyTime = computed(() => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date(props.order.estimatedReadyAt)))

onMounted(() => {
  now.value = Date.now() + serverOffset
  timer = setInterval(() => { now.value = Date.now() + serverOffset }, 1000)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-sm sm:p-7" aria-live="polite">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold tracking-[.18em] text-fire">MY BREAD · 我的面包</p>
        <h2 class="mt-2 font-serif text-3xl font-semibold">{{ order.customerName }}的面包</h2>
      </div>
      <span class="rounded-full px-4 py-2 text-sm font-bold" :class="status === 'ready' ? 'bg-[#ddefd8] text-[#276238]' : status === 'processing' ? 'bg-fire/10 text-fire' : 'bg-ink/10 text-charcoal'">
        {{ ovenOrderStatusLabels[status] }}
      </span>
    </div>
    <div class="mt-7 h-4 overflow-hidden rounded-full bg-[#eadbc5]" :aria-label="`制作进度 ${Math.round(percent)}%`" role="progressbar" :aria-valuenow="Math.round(percent)" aria-valuemin="0" aria-valuemax="100">
      <div class="h-full rounded-full transition-[width] duration-700" :class="status === 'ready' || status === 'collected' ? 'bg-[#37824c]' : 'bg-fire'" :style="{ width: `${percent}%` }" />
    </div>
    <div class="mt-3 flex flex-wrap justify-between gap-2 text-sm">
      <strong>{{ remainingText }}</strong>
      <span class="text-charcoal">预计 {{ readyTime }}</span>
    </div>
  </div>
</template>
