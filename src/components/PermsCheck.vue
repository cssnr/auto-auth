<script setup lang="ts">
import { i18n } from '#imports'
import { ref, onMounted, onUnmounted } from 'vue'
import { debug } from '@/utils/logger.ts'
import { useToast } from '@/composables/useToast.ts'
import { clickOpen } from '@/utils/extension.ts'
import { isFirefox } from '@/utils/system.ts'

const { showToast } = useToast()

const props = withDefaults(
  defineProps<{
    closeWindow?: boolean
    showAlert?: boolean
    showInfo?: boolean
    showRemove?: boolean
  }>(),
  {
    closeWindow: false,
    showAlert: false,
    showInfo: false,
    showRemove: false,
  },
)

const hasPerms = ref(true)

const manifest = chrome.runtime.getManifest()
// NOTE: origins defined: background/index.ts, background/icons.ts
const origins = manifest.host_permissions
// debug('PermsCheck.vue - origins:', origins)

async function updatePerms() {
  hasPerms.value = await chrome.permissions.contains({ origins })
  debug('updatePerms:', hasPerms.value)
}

async function grantPerms(event: Event) {
  debug('grantPerms:', event)
  requestPerms().catch(console.warn)
  if (props.closeWindow) window.close()
}

async function revokePerms(event: Event) {
  debug('revokePerms:', event)
  // NOTE: This was modified to remove origins and not permissions...
  try {
    const permissions = await chrome.permissions.getAll()
    debug('permissions:', permissions)
    await chrome.permissions.remove({ origins })
    await updatePerms()
  } catch (e) {
    // console.error(e)
    const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
    showToast(message, 'danger')
  }
}

async function requestPerms() {
  return await chrome.permissions.request({ origins })
}

onMounted(() => {
  updatePerms()
  chrome.permissions.onAdded.addListener(updatePerms)
  chrome.permissions.onRemoved.addListener(updatePerms)
})

onUnmounted(() => {
  chrome.permissions.onAdded.removeListener(updatePerms)
  chrome.permissions.onRemoved.removeListener(updatePerms)
})
</script>

<template>
  <div v-if="!hasPerms || showAlert || showRemove">
    <div v-if="!hasPerms" class="text-center d-grid gap-2">
      <button
        class="btn btn-lg btn-warning"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        :data-bs-title="i18n.t('perms.grant.tip')"
        @click="grantPerms"
        v-bs
      >
        <i class="fa-solid fa-check-double me-2"></i> {{ i18n.t('perms.grant.text') }}
      </button>
      <p v-if="showInfo" class="text-center mb-0">
        <a href="/permissions.html" target="_blank" @click.prevent="clickOpen($event, closeWindow)">{{
          i18n.t('perms.info')
        }}</a>
      </p>
    </div>

    <div v-if="hasPerms && showAlert" class="alert alert-success mt-3 mb-0" role="alert">
      {{ i18n.t('perms.granted') }}
    </div>

    <div v-if="hasPerms && showRemove && isFirefox">
      <button
        class="btn btn-link link-danger revoke-permissions"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="hover"
        :data-bs-title="i18n.t('perms.remove.tip')"
        @click="revokePerms"
        v-bs
      >
        {{ i18n.t('perms.remove.text') }}
      </button>
    </div>
  </div>
</template>
