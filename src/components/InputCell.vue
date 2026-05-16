<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { debug } from '@/utils/logger.ts'

const props = defineProps<{
  host: string
  field: string
  value: string
  visible?: boolean
  empty?: string
  editable?: boolean
}>()

const emit = defineEmits(['edit'])

const isEditing = ref(false)
const inputValue = ref(props.value)
const inputEl = ref<HTMLInputElement | null>(null)

function startEdit() {
  if (!props.editable) return debug('%cEditing Disabled', 'color: LightCoral')
  if (isEditing.value) return debug('%cDuplicate Start Event', 'color: Plum')
  debug('%cStart Edit:', 'color: Lime', inputValue.value)
  inputValue.value = props.value
  isEditing.value = true
  nextTick(() => {
    inputEl.value?.focus()
    inputEl.value?.select()
  })
}

function finishEdit() {
  debug('%cFinish Edit', 'color: Lime')
  if (!isEditing.value) return debug('%cDuplicate Finish Event', 'color: Plum')
  isEditing.value = false
  if (inputValue.value === props.value) return debug('%cUnchanged:', 'color: Bisque', inputValue.value)
  debug(`%cEdit ${props.field}:`, 'color: Lime', `"${inputValue.value}"`, 'for host:', props.host)
  emit('edit', props.host, props.field, inputValue.value)
}
</script>

<template>
  <td class="text-truncate" @click="startEdit">
    <input
      v-if="isEditing"
      v-model="inputValue"
      ref="inputEl"
      :name="field"
      :type="visible ? 'text' : 'password'"
      class="form-control form-control-sm table-input"
      @keyup.esc="isEditing = false"
      @keyup.enter="finishEdit"
      @blur="finishEdit"
    />
    <span v-if="!isEditing && visible" :class="value ? '' : 'text-muted fst-italic'">{{ value || empty }}</span>
    <span v-if="!isEditing && !visible">******</span>
  </td>
</template>

<style scoped>
.table-input {
  height: auto !important;
  min-height: 0 !important;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
