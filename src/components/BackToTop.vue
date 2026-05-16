<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { debounce } from '@/utils/index.ts'

withDefaults(
  defineProps<{
    btnClass?: string
  }>(),
  {
    btnClass: 'btn-outline-primary',
  },
)

const backToTop = useTemplateRef('backToTop')

const onScroll = () => {
  if (!backToTop.value) return
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTop.value.style.display = 'block'
  } else {
    backToTop.value.style.display = 'none'
  }
}

const topClick = () => {
  if (window.location.hash) {
    window.location.hash = ''
  } else {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }
}

const onScrollDebounced = debounce(onScroll)

onMounted(() => window.addEventListener('scroll', onScrollDebounced))
onUnmounted(() => window.removeEventListener('scroll', onScrollDebounced))
</script>

<template>
  <button ref="backToTop" id="back-to-top" type="button" :class="['btn', btnClass]" @click="topClick">
    <i class="fa-regular fa-square-caret-up"></i>
  </button>
</template>

<style scoped>
#back-to-top {
  position: fixed;
  bottom: 40px;
  right: 10px;
  display: none;
  z-index: 3;
}
</style>
