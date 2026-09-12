import type { DiyResourceItem, TutorialStep } from '~/types/content'

const stepDemoImages: Record<string, string> = {
  '领取面团': '/images/diy-demo/step-01-receive-dough.webp',
  '自由造型': '/images/diy-demo/step-02-shape-dough.webp',
  '添加配料': '/images/diy-demo/step-03-add-toppings.webp',
  '发酵': '/images/diy-demo/step-04-proof.webp',
  '窑炉烤制': '/images/diy-demo/step-05-bake.webp',
  '冷却': '/images/diy-demo/step-06-cool.webp',
  '打包带走': '/images/diy-demo/step-07-pack.webp',
}

const resourceDemoImages: Record<string, string> = {
  '肉松': '/images/diy-demo/ingredient-pork-floss.webp',
  '蔓越莓干': '/images/diy-demo/ingredient-cranberry.webp',
  '葡萄干': '/images/diy-demo/ingredient-raisin.webp',
  '巧克力豆': '/images/diy-demo/ingredient-chocolate-chips.webp',
  '擀面杖': '/images/diy-demo/tool-rolling-pin.webp',
  '切面刀': '/images/diy-demo/tool-dough-scraper.webp',
}

export function withDemoStepImage(step: TutorialStep): TutorialStep {
  if (step.image) return step
  const image = stepDemoImages[step.title]
  if (!image) return step
  return {
    ...step,
    image,
    imageAlt: `${step.title}制作场景AI示意图，待替换为门店实拍`,
    isIllustration: true,
  }
}

export function withDemoResourceImage(item: DiyResourceItem): DiyResourceItem {
  if (item.image) return item
  const image = resourceDemoImages[item.name]
  if (!image) return item
  return {
    ...item,
    image,
    imageAlt: `${item.name}AI示意图，待替换为门店实拍`,
    isIllustration: true,
  }
}

export function createDemoResources(names: string[]): DiyResourceItem[] {
  return names.map(name => withDemoResourceImage({ name, imageAlt: `${name}图片` }))
}
