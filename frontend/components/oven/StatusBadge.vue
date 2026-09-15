<script setup lang="ts">
import { ovenStatusLabels, type OvenBatchStatus } from '~/types/oven'

defineProps<{ status: OvenBatchStatus }>()
</script>

<template>
  <span
    class="inline-flex min-h-9 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[.12em]"
    :class="{
      'border-fire/25 bg-fire/10 text-fire': status === 'preparing',
      'border-[#a56432]/30 bg-[#a56432]/10 text-[#8b4f26]': status === 'baking',
      'border-lake/25 bg-lake/10 text-lake': status === 'ready',
      'border-ink/15 bg-ink/5 text-charcoal': status === 'finished',
    }"
  >
    <span aria-hidden="true">{{ status === 'ready' ? '✓' : status === 'finished' ? '·' : '🔥' }}</span>
    {{ ovenStatusLabels[status] }}
  </span>
</template>
