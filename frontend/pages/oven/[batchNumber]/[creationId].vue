<script setup lang="ts">
const route = useRoute()
const { creation: getCreation, addFire, uploadAfterImage, ownerToken } = useOven()
const { compressGuestImage } = useGuestImage()
const creationId = computed(() => String(route.params.creationId || ''))
const routeBatch = computed(() => String(route.params.batchNumber || '').padStart(3, '0'))
const { data: creation, error } = await useAsyncData(
  () => `oven-creation-${creationId.value}`,
  () => getCreation(creationId.value),
)
if (error.value || (creation.value && creation.value.batch.batchNumber !== routeBatch.value)) {
  throw createError({ statusCode: 404, statusMessage: '没有找到这个面包档案' })
}

const isOwner = ref(false)
const fireLoading = ref(false)
const uploadLoading = ref(false)
const message = ref('')
const uploadError = ref('')
const afterPreview = ref('')
const afterFile = ref<File>()
const canReact = computed(() => creation.value?.batch.status !== 'finished')
const canUploadAfter = computed(() => creation.value?.batch.status === 'ready' && isOwner.value)

const formattedDate = computed(() => {
  const value = creation.value?.batch.batchDate
  if (!value) return ''
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
})

useSeoMeta({
  title: () => creation.value ? `第 ${creation.value.batch.batchNumber} 炉 · ${creation.value.breadName}` : '我的镇山面包档案',
  description: () => creation.value ? `${creation.value.nickname}在贵阳镇山村制作的“${creation.value.breadName}”窑烤面包档案。` : '',
})

onMounted(() => { isOwner.value = Boolean(ownerToken(creationId.value)) })

async function handleFire() {
  if (!creation.value || fireLoading.value) return
  fireLoading.value = true
  message.value = ''
  try {
    const result = await addFire(creation.value.documentId)
    creation.value.fireCount = result.fireCount
    message.value = result.added ? '这一把柴，添上了。' : '你已经为它添过柴了。'
  } catch (error: any) {
    message.value = error.message
  } finally {
    fireLoading.value = false
  }
}

async function chooseAfterImage(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0]
  if (!selected) return
  uploadError.value = ''
  try {
    const compressed = await compressGuestImage(selected)
    if (afterPreview.value) URL.revokeObjectURL(afterPreview.value)
    afterFile.value = compressed
    afterPreview.value = URL.createObjectURL(compressed)
  } catch (error: any) {
    uploadError.value = error.message
    input.value = ''
  }
}

async function submitAfterImage() {
  if (!creation.value || !afterFile.value || uploadLoading.value) return
  uploadLoading.value = true
  uploadError.value = ''
  try {
    creation.value = await uploadAfterImage(creation.value.documentId, afterFile.value)
    message.value = '出炉后的模样已经收进面包档案。'
    afterFile.value = undefined
    if (afterPreview.value) URL.revokeObjectURL(afterPreview.value)
    afterPreview.value = ''
  } catch (error: any) {
    uploadError.value = error.message
  } finally {
    uploadLoading.value = false
  }
}

onBeforeUnmount(() => { if (afterPreview.value) URL.revokeObjectURL(afterPreview.value) })
</script>

<template>
  <div v-if="creation" class="min-h-screen bg-flour">
    <section class="page-wrap py-8 md:py-14">
      <NuxtLink :to="`/oven/${creation.batch.batchNumber}`" class="text-sm font-semibold text-fire hover:underline">← 返回第 {{ creation.batch.batchNumber }} 炉</NuxtLink>

      <div class="mt-7 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div class="overflow-hidden rounded-[2rem] bg-[#dec8a5] shadow-[0_24px_70px_rgba(33,28,25,.13)]" v-reveal>
          <ContentImage
            v-if="creation.beforeImage"
            :image="creation.beforeImage"
            :alt="creation.beforeImage.alt || `${creation.breadName}入窑前照片`"
            sizes="(min-width: 1024px) 58vw, 100vw"
            class="aspect-[4/3] h-full w-full object-cover"
            loading="eager"
          />
        </div>

        <div class="lg:sticky lg:top-28" v-reveal="100">
          <div class="flex flex-wrap items-center gap-3"><span class="eyebrow">第 {{ creation.batch.batchNumber }} 炉</span><OvenStatusBadge :status="creation.batch.status" /></div>
          <h1 class="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">《{{ creation.breadName }}》</h1>
          <p class="mt-4 text-lg text-charcoal">面包师：{{ creation.nickname }}</p>
          <p class="mt-6 font-serif text-3xl font-semibold text-fire">🔥 {{ creation.fireCount }} 把柴</p>
          <button v-if="canReact" type="button" class="btn-primary mt-5" :disabled="fireLoading" @click="handleFire">{{ fireLoading ? '添柴中…' : '添一把柴 🔥' }}</button>
          <p v-if="message" class="mt-4 text-sm leading-6 text-charcoal" role="status">{{ message }}</p>

          <dl class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10">
            <div class="bg-[#fbf5ec] p-5"><dt class="text-xs tracking-[.15em] text-charcoal">出生于</dt><dd class="mt-2 font-semibold">贵州 · 贵阳 · 镇山村</dd></div>
            <div class="bg-[#fbf5ec] p-5"><dt class="text-xs tracking-[.15em] text-charcoal">制作日期</dt><dd class="mt-2 font-semibold">{{ formattedDate }}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="border-y border-ink/10 bg-[#ead8bd] py-12 md:py-20">
      <div class="page-wrap">
        <div class="mb-8 max-w-2xl">
          <p class="eyebrow">BEFORE · AFTER</p>
          <h2 class="mt-3 section-title">我的镇山面包档案</h2>
          <p class="mt-4 body-copy">从刚捏好的模样，到带着窑火香气出炉。今天，它出生在镇山村。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <figure class="paper-card overflow-hidden">
            <ContentImage v-if="creation.beforeImage" :image="creation.beforeImage" :alt="`${creation.breadName}入窑前`" sizes="(min-width: 768px) 50vw, 100vw" class="aspect-[4/3] w-full object-cover" />
            <figcaption class="p-5 font-serif text-xl font-semibold">入窑前</figcaption>
          </figure>
          <figure class="paper-card overflow-hidden">
            <ContentImage v-if="creation.afterImage" :image="creation.afterImage" :alt="`${creation.breadName}出炉后`" sizes="(min-width: 768px) 50vw, 100vw" class="aspect-[4/3] w-full object-cover" />
            <div v-else class="grid aspect-[4/3] place-items-center bg-[#d6bd94] px-6 text-center text-charcoal"><p><span class="block text-4xl" aria-hidden="true">🔥</span><b class="mt-3 block font-serif text-2xl">还在等出炉后的模样</b></p></div>
            <figcaption class="p-5 font-serif text-xl font-semibold">出炉后</figcaption>
          </figure>
        </div>

        <div v-if="canUploadAfter" class="paper-card mt-8 p-5 sm:p-7">
          <h3 class="font-serif text-2xl font-semibold">补上出炉后的照片</h3>
          <p class="mt-2 text-sm leading-6 text-charcoal">这台浏览器保存着作品凭证，可以上传或更换出炉照片。</p>
          <div class="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <label class="btn-secondary cursor-pointer"><input type="file" accept="image/jpeg,image/png,image/webp,image/*" capture="environment" class="sr-only" @change="chooseAfterImage" />选择出炉照片</label>
            <span v-if="afterFile" class="truncate text-sm text-charcoal">{{ afterFile.name }}</span>
            <button v-if="afterFile" type="button" class="btn-primary sm:ml-auto" :disabled="uploadLoading" @click="submitAfterImage">{{ uploadLoading ? '保存中…' : '保存到面包档案' }}</button>
          </div>
          <img v-if="afterPreview" :src="afterPreview" alt="准备上传的出炉照片预览" class="mt-5 max-h-80 w-full rounded-2xl object-cover" />
          <p v-if="uploadError" class="mt-4 text-sm text-fire" role="alert">{{ uploadError }}</p>
        </div>
        <p v-else-if="creation.batch.status === 'ready' && !creation.afterImage" class="mt-6 rounded-2xl bg-white/50 p-4 text-sm leading-6 text-charcoal">出炉照片只能由最初提交作品的浏览器上传；凭证丢失时可请店员在后台代为补图。</p>
      </div>
    </section>
  </div>
</template>
