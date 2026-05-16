<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, ref, useTemplateRef } from 'vue'
import { Modal } from 'bootstrap'
import { debug } from '@/utils/logger.ts'
import { importCredentials } from '@/utils/creds.ts'

defineOptions({
  inheritAttrs: false,
})

const modalEl = useTemplateRef('modalEl')
const textareaEl = useTemplateRef('textareaEl')
const textRef = ref('')
const invalidText = ref('')

async function importClick() {
  // debug('importClick:', event)
  debug('importClick - textRef.value:', textRef.value)
  if (!textRef.value) {
    textareaEl.value?.focus()
    return
  }
  let data
  try {
    data = JSON.parse(textRef.value)
  } catch (e) {
    let err = i18n.t('import.errorJson')
    if (e instanceof Error) err += `: ${e.message}`
    invalidText.value = err
    textareaEl.value?.focus()
    return
  }
  try {
    // NOTE: This should NOT throw, but just in case...
    await importCredentials(data)
    if (modalEl.value) Modal.getInstance(modalEl.value)?.hide()
    textRef.value = ''
  } catch (e) {
    let err = i18n.t('import.errorUnknown')
    if (e instanceof Error) err += `: ${e.message}`
    invalidText.value = err
  }
}

function clearClick() {
  textRef.value = ''
  invalidText.value = ''
  textareaEl.value?.focus()
}

onMounted(() => {
  if (!modalEl.value) return console.error('no modalEl')
  modalEl.value.addEventListener('shown.bs.modal', () => {
    textareaEl.value?.focus()
    textareaEl.value?.select()
  })
  modalEl.value.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
  modalEl.value.addEventListener('hidden.bs.modal', () => (invalidText.value = ''))
})
</script>

<template>
  <button v-bind="$attrs" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#import-modal">
    <i class="fa-solid fa-align-left ms-1"></i> {{ i18n.t('import.importText') }}
  </button>

  <Teleport to="body">
    <div
      ref="modalEl"
      class="modal fade"
      id="import-modal"
      tabindex="-1"
      aria-labelledby="import-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="import-modal-label">{{ i18n.t('import.importCredentials') }}</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :aria-label="i18n.t('ui.action.close')"
              tabindex="-1"
            ></button>
          </div>
          <div class="modal-body">
            <div class="">
              <label for="import-textarea" class="mb-1">
                {{ i18n.t('import.jsonImport') }} <i class="fa-solid fa-code"></i>
              </label>
              <textarea
                v-model="textRef"
                ref="textareaEl"
                class="form-control"
                :class="{ 'is-invalid': invalidText }"
                :placeholder="i18n.t('import.placeholder')"
                id="import-textarea"
                style="height: 100px"
                @input="invalidText = ''"
              ></textarea>
              <div class="invalid-feedback">{{ invalidText }}</div>
              <div>
                {{ i18n.t('import.formatSee') }}
                <a
                  href="https://github.com/cssnr/auto-auth?tab=readme-ov-file#Migration"
                  target="_blank"
                  rel="noopener"
                >
                  {{ i18n.t('import.migrationGuide') }}</a
                >
                {{ i18n.t('import.onGithub') }}.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="import-text" type="button" class="btn btn-success me-auto" @click.prevent="importClick">
              <i class="fa-solid fa-cloud-arrow-down me-2"></i> {{ i18n.t('import.import') }}
            </button>
            <button id="clear-import" type="button" class="btn btn-outline-warning" @click="clearClick">
              {{ i18n.t('ui.action.clear') }}
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
