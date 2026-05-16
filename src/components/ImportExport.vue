<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, ref, useTemplateRef } from 'vue'
import { debug } from '@/utils/logger.ts'
import { importCredentials } from '@/utils/creds.ts'
import { showToast } from '@/composables/useToast.ts'
import { Hosts } from '@/utils/hosts.ts'

const modalEl = useTemplateRef('modalEl')
const hostsInput = ref()

async function exportHosts() {
  debug('exportHosts')
  const hosts = await Hosts.all()
  // debug('hosts:', hosts)
  if (Object.keys(hosts).length === 0) {
    return showToast(i18n.t('ui.text.noCredentialsExport'), 'warning')
  }
  const json = JSON.stringify(hosts, null, 2)
  textFileDownload('auto-auth-secrets.txt', json)
}

function textFileDownload(filename: string, text: string) {
  debug(`textFileDownload: ${filename}`)
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.classList.add('d-none')
  document.body.appendChild(element)
  element.click()
  element.remove()
}

// async function importHostsClick() {
//   debug('importHostsClick - hostsInput.value:', hostsInput.value)
//   hostsInput.value?.click()
// }

async function hostsInputChange(event: Event) {
  debug('hostsInputChange:', event)
  try {
    const target = event.currentTarget as HTMLInputElement
    const file = target.files?.item(0)
    if (!file) return showToast(i18n.t('ui.text.errorReadingFile'), 'error')
    const text = await file.text()
    debug('text:', text)
    const data = JSON.parse(text)
    debug('data:', data)
    await importCredentials(data)
  } catch (e) {
    // console.log(e)
    const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
    showToast(`${i18n.t('ui.text.importError')}: ${message}`, 'warning')
  }
}

onMounted(() => {
  modalEl.value?.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
})
</script>

<template>
  <div>
    <a
      ref="modalEl"
      id="export-hosts"
      class="link-body-emphasis text-decoration-none d-inline-block"
      role="button"
      @click.prevent="exportHosts"
    >
      {{ i18n.t('import.exportAll') }} <i class="fa-solid fa-right-from-bracket fa-rotate-90 ms-1"></i
    ></a>
    <span class="mx-2">&bull;</span>
    <input ref="hostsInput" type="file" style="display: none" @change.prevent="hostsInputChange" />
    <a
      id="import-file"
      class="link-body-emphasis text-decoration-none d-inline-block"
      role="button"
      @click.prevent="hostsInput?.click()"
    >
      {{ i18n.t('import.importFile') }} <i class="fa-solid fa-right-to-bracket fa-rotate-90 ms-1"></i
    ></a>
  </div>
</template>
