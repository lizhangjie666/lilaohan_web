<script setup lang="ts">
import type { TutorialStep } from '~/types/content'
defineProps<{ steps: TutorialStep[] }>()
</script>

<template>
  <ol class="relative grid gap-4 before:absolute before:bottom-6 before:left-[1.65rem] before:top-6 before:w-px before:bg-fire/30 md:grid-cols-2 md:before:hidden lg:grid-cols-4">
    <li v-for="(step, index) in steps" :key="`${index}-${step.title}`" v-reveal="index * 70" class="motion-reveal relative ml-14 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-sm md:ml-0">
      <div class="absolute -left-[3.55rem] top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-fire font-bold text-white md:left-5">{{ index + 1 }}</div>
      <div class="relative aspect-[4/3] overflow-hidden bg-[#e9d5b3]">
        <ContentImage v-if="step.image" :image="step.image" :alt="step.imageAlt" sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw" class="h-full w-full object-cover" />
        <span v-if="step.isIllustration" class="absolute right-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-[10px] font-semibold tracking-[.12em] text-white backdrop-blur-sm">AI 示意图</span>
        <div v-else class="grid h-full place-items-center bg-[radial-gradient(circle_at_75%_20%,rgba(229,83,24,.2),transparent_38%),linear-gradient(145deg,#ead7b4,#f8ecd5)] text-center">
          <span><b class="block font-serif text-6xl text-ink/15">{{ String(index + 1).padStart(2, '0') }}</b><small class="mt-2 block tracking-[.2em] text-ink/45">步骤照片待上传</small></span>
        </div>
      </div>
      <div class="p-6 pt-5"><p class="text-xs font-bold tracking-[.16em] text-fire">STEP {{ String(index + 1).padStart(2, '0') }}</p><h3 class="mt-2 font-serif text-2xl font-semibold">{{ step.title }}</h3><p class="mt-3 leading-7 text-charcoal">{{ step.description }}</p></div>
    </li>
  </ol>
</template>
