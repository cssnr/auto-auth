<script setup lang="ts">
import { i18n } from '#imports'
import { computed, onMounted, ref } from 'vue'
import { isFirefox, isMobile } from '@/utils/system.ts'
import { debug } from '@/utils/logger.ts'
import { submitHost } from '@/utils/index.ts'
import { parseCreds } from '@/utils/creds.ts'
import { showToast } from '@/composables/useToast.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { Hosts } from '@/utils/hosts.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import HostModal from '@/components/HostModal.vue'
import OpenOptionsBtn from '@/components/OpenOptionsBtn.vue'

const isBrowser = isFirefox ? '360px' : null
const width = computed(() => (isMobile ? '100%' : isBrowser))
debug('width:', width.value)

const options = useOptions()

const hostnameRef = ref('') // tab hostname
const usernameRef = ref('') // saved username
const savedCreds = ref('') // has credentials

const deleteModal = ref<InstanceType<typeof DeleteModal> | null>(null)
const hostModal = ref<InstanceType<typeof HostModal> | null>(null)

// DUPLICATION: HostsTable.vue
function deleteClick(host: string) {
  debug('popup/App.vue - deleteClick:', host)
  if (options.value.confirmDelete) {
    deleteModal.value?.show(host)
  } else {
    deleteHost(host)
  }
}

// DUPLICATION: HostsTable.vue
async function deleteHost(host: string) {
  debug('popup/App.vue - deleteHost:', host)
  // const creds = hosts.value[host]
  // debug('creds:', creds)
  try {
    await Hosts.delete(host)
    savedCreds.value = '' // NOTE: These 2 lines are only differences
    usernameRef.value = '' // NOTE: These 2 lines are only differences
    showToast(`${i18n.t('ui.text.removed')}: ${host}`, 'success')
  } catch (e) {
    const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
    showToast(`${i18n.t('ui.text.deleteHostError')}: ${message}`, 'danger')
  }
}

async function onSubmit(host: string, user: string, pass: string, original?: string) {
  debug('popup/App.vue - onSubmit:', host, user, pass, original)
  await submitHost(host, user, pass, original)
  savedCreds.value = `${user}:${pass}`
  usernameRef.value = user
}

onMounted(async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
  debug('tab:', tab)
  if (!tab.url) return debug('No URL for Tab - No Access.')
  const url = new URL(tab.url)
  debug('url:', url)
  hostnameRef.value = url.host
  const creds = await Hosts.get(url.host)
  debug('creds:', creds)
  if (!creds) return debug('No Saved Creds for Host.')
  savedCreds.value = creds
  usernameRef.value = parseCreds(creds)[0]
})
</script>

<template>
  <div id="popupContainer">
    <PanelHeader :close-window="true" :popup-button="false" />

    <div class="d-grid gap-2 p-1">
      <PermsCheck :close-window="true" />

      <div v-if="!hostnameRef" class="text-center rounded border border-2 border-danger-subtle p-1">
        {{ i18n.t('popup.noAccess') }}
      </div>
      <div v-if="hostnameRef && !savedCreds" class="text-center rounded border border-2 p-1">
        {{ i18n.t('popup.noSaved') }}
      </div>
      <template v-if="savedCreds">
        <div
          id="username"
          class="text-center rounded border border-2 text-truncate p-1"
          :class="savedCreds === 'ignored' ? 'border-warning-subtle' : 'border-success-subtle'"
        >
          {{ i18n.t('ui.text.username') }}:
          <span class="fw-bold" :class="savedCreds === 'ignored' ? 'text-warning-emphasis' : 'text-success-emphasis'">{{
            savedCreds === 'ignored' ? i18n.t('popup.hostIgnored') : usernameRef
          }}</span>
        </div>

        <button
          v-if="savedCreds !== 'ignored'"
          class="btn btn-outline-warning"
          @click.prevent="hostModal?.show(hostnameRef, savedCreds)"
        >
          <i class="fa-solid fa-pen-to-square me-1"></i>
          <span>{{ i18n.t('popup.editCreds') }}</span>
        </button>

        <button class="btn btn-outline-danger" @click="deleteClick(hostnameRef)">
          <i class="fa-regular fa-trash-can me-1"></i>
          <span>{{ i18n.t('popup.deleteCreds') }}</span>
        </button>
      </template>

      <OptionsForm :close-window="true" :compact="true" :show="['switches']" class="px-1" />

      <OpenOptionsBtn :close-window="true">{{ i18n.t('popup.moreOptions') }}</OpenOptionsBtn>
    </div>

    <DeleteModal ref="deleteModal" @delete="deleteHost" />
    <HostModal ref="hostModal" @submit="onSubmit" :compact="true" />
    <ToastAlerts />
  </div>
</template>

<style scoped>
#popupContainer {
  width: v-bind(width);
}
</style>
