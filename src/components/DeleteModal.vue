<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, ref, useTemplateRef } from 'vue'
import { Modal } from 'bootstrap'

defineExpose({ show })

const emit = defineEmits(['delete'])

const modalEl = useTemplateRef('modalEl')
const hostRef = ref('')

function show(host: string) {
  if (!modalEl.value) return console.error('no modalEl')
  hostRef.value = host
  Modal.getOrCreateInstance(modalEl.value).show()
}

function hide() {
  if (!modalEl.value) return console.error('no modalEl')
  Modal.getInstance(modalEl.value)?.hide()
}

function onDelete() {
  emit('delete', hostRef.value)
  hide()
}

onMounted(() => {
  modalEl.value?.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
})
</script>

<template>
  <Teleport to="body">
    <div class="modal fade" ref="modalEl" tabindex="-1" aria-labelledby="delete-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 text-truncate" id="delete-modal-label">
              {{ i18n.t('ui.action.delete') }} {{ i18n.t('ui.text.host') }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :aria-label="i18n.t('ui.action.close')"
              tabindex="-1"
            ></button>
          </div>
          <div class="modal-body text-center p-2">
            <kbd class="text-truncate fs-5" style="min-width: 0">{{ hostRef }}</kbd>
          </div>
          <div class="modal-footer p-2">
            <button type="button" class="btn btn-danger me-auto" @click.prevent="onDelete">
              <i class="fa-regular fa-trash-can me-2"></i> {{ i18n.t('ui.action.delete') }}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ i18n.t('ui.action.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
