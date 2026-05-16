import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: string
}

// Module-level state — shared singleton across all imports
const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function showToast(message: string, type = 'primary') {
    // console.debug(`showToast: ${type}: ${message}`)
    toasts.value.push({ id: nextId++, message, type })
  }

  // function removeToast(id: number) {
  //   toasts.value = toasts.value.filter((t) => t.id !== id)
  // }
  function removeToast(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  return { toasts, showToast, removeToast }
}

// Named export so you can call showToast() outside of components
// (e.g. in a utils file, api handler, etc.) without calling useToast()
export function showToast(message: string, type = 'primary') {
  // console.debug(`showToast: ${type}: ${message}`)
  toasts.value.push({ id: nextId++, message, type })
}
