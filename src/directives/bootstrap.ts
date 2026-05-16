import { isMobile } from '@/utils/system.ts'
import { Tooltip, Popover } from 'bootstrap'

const COMPONENTS: Record<string, typeof Tooltip | typeof Popover> = {
  tooltip: Tooltip,
  popover: Popover,
}

const instances = new WeakMap<HTMLElement, Tooltip | Popover>()

export const bootstrapDirective = {
  mounted(el: HTMLElement) {
    if (isMobile) return
    const component = COMPONENTS[el.dataset.bsToggle ?? '']
    if (component) instances.set(el, new component(el))
  },
  unmounted(el: HTMLElement) {
    if (isMobile) return
    instances.get(el)?.dispose()
    instances.delete(el)
  },
}
