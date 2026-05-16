<script setup lang="ts">
import { useToast } from '@/composables/useToast.ts'
import { Toast } from 'bootstrap'

const { toasts, removeToast } = useToast()

// noinspection JSUnusedGlobalSymbols
const vToast = {
  mounted(el: HTMLElement, binding: { value: number }) {
    const bsToast = new Toast(el)
    el.addEventListener('mousemove', () => bsToast.hide())
    el.addEventListener('hidden.bs.toast', () => removeToast(binding.value))
    bsToast.show()
  },
}
</script>

<template>
  <div aria-live="polite" aria-atomic="true" class="">
    <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        v-toast="toast.id"
        class="toast align-items-center border-0"
        :class="`text-bg-${toast.type}`"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-delay="10000"
      >
        <div class="toast-body">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>
