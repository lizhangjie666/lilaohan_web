<script setup lang="ts">
defineProps<{ price: number; priceUnit: string }>()
const { handleBooking } = useBooking()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 border-t border-ink/10 bg-[#fff8e9]/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden" style="padding-bottom:calc(.75rem + env(safe-area-inset-bottom))">
    <div class="min-w-0 flex-1"><strong class="font-serif text-2xl text-fire">¥{{ price }}</strong><span class="ml-1 text-xs text-charcoal">/{{ priceUnit.replace('元', '').replace('/', '').trim() || '人' }}</span></div>
    <button type="button" class="rounded-full bg-fire px-7 py-3 font-semibold text-white" @click="handleBooking">立即预约</button>
  </div>
</template>
