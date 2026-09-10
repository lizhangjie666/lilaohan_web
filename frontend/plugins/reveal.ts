export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps: () => ({}),
    })
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const savesData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const motionEnabled = !prefersReducedMotion && !savesData

  if (motionEnabled) document.documentElement.classList.add('motion-enabled')

  const observer = motionEnabled
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    : null

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      el.classList.add('motion-reveal')
      const delay = Math.max(0, Number(binding.value) || 0)
      el.style.setProperty('--reveal-delay', `${delay}ms`)

      if (observer) observer.observe(el)
      else el.classList.add('is-visible')
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
