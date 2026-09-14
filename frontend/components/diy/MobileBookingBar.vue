<script setup lang="ts">
const { handleBooking } = useBooking()
</script>

<template>
  <div class="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-ink/10 bg-[#fff8e9]/95 px-4 py-3 shadow-2xl backdrop-blur md:hidden" style="padding-bottom:calc(.75rem + env(safe-area-inset-bottom))">
    <button type="button" class="w-full max-w-md rounded-full bg-fire px-7 py-3 font-semibold text-white" @click="handleBooking">添加微信预约</button>
  </div>
</template>
