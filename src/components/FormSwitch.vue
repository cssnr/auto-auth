<script setup lang="ts">
import { i18n } from '#imports'
import { computed } from 'vue'
import { isMobile } from '@/utils/system.ts'
import { saveKeyValue } from '@/utils/options.ts'

const model = defineModel()

const props = defineProps<{
  id: string
  label?: string
  tooltip?: string
}>()

const labelText = computed(() => props.label || i18n.t(`option.toggle.${props.id}.label` as any))
const tooltipText = computed(() => props.tooltip || i18n.t(`option.toggle.${props.id}.tip` as any))

const onChange = () => saveKeyValue(props.id, model.value)
</script>

<template>
  <div class="form-check form-switch">
    <input v-model="model" :id="id" @change="onChange" class="form-check-input" type="checkbox" role="switch" />
    <label class="form-check-label" :for="id">{{ labelText }}</label>
    <i
      v-if="!isMobile && tooltipText"
      class="fa-solid fa-circle-info ms-2 d-none d-sm-inline-block"
      data-bs-toggle="tooltip"
      :data-bs-title="tooltipText"
      v-bs
    ></i>
  </div>
</template>
