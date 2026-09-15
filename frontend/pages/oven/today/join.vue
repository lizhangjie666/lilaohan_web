<script setup lang="ts">
const { today, createCreation } = useOven()
const { compressGuestImage } = useGuestImage()
const { data: todayState, refresh } = await useAsyncData('oven-today-join', today)
const batch = computed(() => todayState.value?.batch || null)

const nickname = ref('')
const breadName = ref('')
const consent = ref(false)
const image = ref<File>()
const preview = ref('')
const processingImage = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

const canJoin = computed(() => batch.value?.status === 'preparing')

useSeoMeta({ title: '加入今日同炉｜李老汉窑烤面包', robots: 'noindex,follow' })

async function chooseImage(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0]
  if (!selected) return
  processingImage.value = true
  errorMessage.value = ''
  try {
    const compressed = await compressGuestImage(selected)
    if (preview.value) URL.revokeObjectURL(preview.value)
    image.value = compressed
    preview.value = URL.createObjectURL(compressed)
  } catch (error: any) {
    image.value = undefined
    errorMessage.value = error.message
    input.value = ''
  } finally {
    processingImage.value = false
  }
}

async function submit() {
  errorMessage.value = ''
  if (!nickname.value.trim() || !breadName.value.trim() || !image.value || !consent.value) {
    errorMessage.value = '请填写昵称和面包名字、选择照片，并确认作品墙展示说明。'
    return
  }
  submitting.value = true
  try {
    const creation = await createCreation({
      nickname: nickname.value.trim(),
      breadName: breadName.value.trim(),
      beforeImage: image.value,
      consent: consent.value,
    })
    await navigateTo(`/oven/${creation.batch.batchNumber}?submitted=${creation.documentId}`)
  } catch (error: any) {
    errorMessage.value = error.message
    await refresh()
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => { if (preview.value) URL.revokeObjectURL(preview.value) })
</script>

<template>
  <div class="min-h-screen bg-flour py-10 md:py-16">
    <div class="page-wrap">
      <NuxtLink :to="batch ? `/oven/${batch.batchNumber}` : '/oven/today'" class="text-sm font-semibold text-fire hover:underline">← 返回今日同炉</NuxtLink>

      <div v-if="canJoin" class="mx-auto mt-7 max-w-3xl">
        <header class="mb-8" v-reveal>
          <p class="eyebrow">JOIN THE OVEN · 加入这一炉</p>
          <div class="mt-3 flex flex-wrap items-center gap-4">
            <h1 class="font-serif text-4xl font-semibold sm:text-6xl">🔥 第 {{ batch?.batchNumber }} 炉</h1>
            <OvenStatusBadge v-if="batch" :status="batch.status" />
          </div>
          <p class="mt-4 text-lg leading-8 text-charcoal">今天，我们一起等这一炉面包出炉。</p>
        </header>

        <form class="paper-card space-y-7 p-5 sm:p-8" @submit.prevent="submit">
          <div class="grid gap-6 sm:grid-cols-2">
            <label class="grid gap-2 font-semibold">
              <span>你的昵称</span>
              <input v-model="nickname" maxlength="20" autocomplete="nickname" placeholder="例如：小雨" class="min-h-14 rounded-2xl border border-ink/20 bg-white px-4 text-base outline-none transition focus:border-fire focus:ring-2 focus:ring-fire/20" />
            </label>
            <label class="grid gap-2 font-semibold">
              <span>给面包取个名字</span>
              <input v-model="breadName" maxlength="30" placeholder="例如：小石头" class="min-h-14 rounded-2xl border border-ink/20 bg-white px-4 text-base outline-none transition focus:border-fire focus:ring-2 focus:ring-fire/20" />
            </label>
          </div>

          <div>
            <p class="font-semibold">面包入窑前照片</p>
            <label class="mt-2 block cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed border-fire/30 bg-[#f0ddbf] transition hover:border-fire focus-within:ring-2 focus-within:ring-fire">
              <input type="file" accept="image/jpeg,image/png,image/webp,image/*" capture="environment" class="sr-only" @change="chooseImage" />
              <div v-if="preview" class="aspect-[4/3]"><img :src="preview" alt="准备上传的入窑前照片预览" class="h-full w-full object-cover" /></div>
              <div v-else class="grid min-h-56 place-items-center px-6 py-10 text-center">
                <div><span class="text-4xl" aria-hidden="true">📷</span><b class="mt-3 block text-lg">{{ processingImage ? '正在处理照片…' : '拍照或从相册选择' }}</b><small class="mt-2 block leading-6 text-charcoal">上传前会自动压缩，不保留照片定位信息。</small></div>
              </div>
            </label>
          </div>

          <label class="flex cursor-pointer items-start gap-3 rounded-2xl bg-ink/5 p-4 text-sm leading-6">
            <input v-model="consent" type="checkbox" class="mt-1 h-5 w-5 shrink-0 accent-[#c84f2f]" />
            <span>上传即表示你同意将该作品展示在“今日同炉”作品墙中。请不要上传包含他人清晰正脸或敏感信息的照片。</span>
          </label>

          <p v-if="errorMessage" class="rounded-2xl border border-fire/20 bg-fire/10 px-4 py-3 text-sm leading-6 text-fire" role="alert">{{ errorMessage }}</p>
          <button type="submit" class="btn-primary w-full text-lg" :disabled="submitting || processingImage">
            {{ submitting ? '正在送进这一炉…' : '提交我的面包' }}
          </button>
        </form>
      </div>

      <div v-else class="mx-auto mt-20 max-w-xl text-center">
        <span class="text-5xl" aria-hidden="true">🔥</span>
        <h1 class="mt-5 font-serif text-4xl font-semibold">现在还不能加入这一炉。</h1>
        <p class="mt-4 leading-8 text-charcoal">{{ batch ? '这一炉已经进入烘烤或出炉阶段，新的作品请等待下一炉。' : '新的窑火还没有升起，请稍后再来看看。' }}</p>
        <NuxtLink :to="batch ? `/oven/${batch.batchNumber}` : '/oven/today'" class="btn-primary mt-7">{{ batch ? '看看这一炉作品' : '返回今日同炉' }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
