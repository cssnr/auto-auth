<script setup lang="ts">
import { openOptions } from '@/utils/extension.ts'

defineProps<{
  closeWindow?: boolean
}>()
</script>

<template>
  <a class="btn btn-outline-info w-100" href="/options.html" @click.prevent="openOptions(closeWindow)">
    <i class="fa-solid fa-sliders me-2"></i> <slot
  /></a>
</template>
