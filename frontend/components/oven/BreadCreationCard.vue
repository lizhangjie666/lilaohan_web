<script setup lang="ts">
import type { BreadCreationPublic, OvenBatchStatus } from '~/types/oven'

const props = defineProps<{
  creation: BreadCreationPublic
  batchNumber: string
  status: OvenBatchStatus
  highlighted?: boolean
}>()
const emit = defineEmits<{ fire: [documentId: string, fireCount: number] }>()

const { addFire } = useOven()
const fireCount = ref(props.creation.fireCount)
const loading = ref(false)
const message = ref('')
const canReact = computed(() => props.status !== 'finished')

watch(() => props.creation.fireCount, value => { fireCount.value = value })

async function handleFire() {
  if (!canReact.value || loading.value) return
  loading.value = true
  message.value = ''
  try {
    const result = await addFire(props.creation.documentId)
    fireCount.value = result.fireCount
    message.value = result.added ? '这一把柴，添上了。' : '你已经为它添过柴了。'
    emit('fire', props.creation.documentId, result.fireCount)
  } catch (error: any) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <article
    class="paper-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(33,28,25,.12)]"
    :class="highlighted ? 'ring-2 ring-fire ring-offset-4 ring-offset-flour' : ''"
  >
    <NuxtLink
      :to="`/oven/${batchNumber}/${creation.documentId}`"
      class="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fire"
      :aria-label="`查看${creation.breadName}的面包档案`"
    >
      <div class="aspect-[4/3] overflow-hidden bg-[#ddc8a7]">
        <ContentImage
          v-if="creation.beforeImage"
          :image="creation.beforeImage"
          :alt="creation.beforeImage.alt || `${creation.breadName}入窑前照片`"
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />
      </div>
      <div class="px-5 pb-3 pt-5">
        <h2 class="font-serif text-2xl font-semibold leading-tight">《{{ creation.breadName }}》</h2>
        <p class="mt-2 text-sm text-charcoal">面包师：{{ creation.nickname }}</p>
      </div>
    </NuxtLink>
    <div class="px-5 pb-5">
      <div class="flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <span class="font-serif text-xl font-semibold text-fire" :aria-label="`${fireCount}把柴`">🔥 {{ fireCount }}</span>
        <button
          type="button"
          class="min-h-11 rounded-full border border-fire/30 px-4 py-2 text-sm font-semibold text-fire transition hover:bg-fire hover:text-white disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-charcoal/50"
          :disabled="!canReact || loading"
          @click="handleFire"
        >{{ status === 'finished' ? '这一炉已结束' : loading ? '添柴中…' : '添一把柴 🔥' }}</button>
      </div>
      <p v-if="message" class="mt-3 text-xs leading-5 text-charcoal" role="status">{{ message }}</p>
    </div>
  </article>
</template>
