<script setup lang="ts">
import { useAppConfig } from '#imports'
import { isFirefox, isMobile } from '@/utils/system.ts'
import { getOptions } from '@/utils/options.ts'
import { showToast } from '@/composables/useToast.ts'
import { Hosts } from '@/utils/hosts.ts'

const props = defineProps<{
  message: string
  tip: string
}>()

async function copySupport() {
  const date = new Date()
  const config = useAppConfig()
  const permissions = await chrome.permissions.getAll()
  const userSettings = await chrome.action.getUserSettings()
  const options = await getOptions()
  const local = await chrome.storage.local.get()
  const hosts = await Hosts.all()

  options.pictureURL = `length: ${options.pictureURL.length}`
  options.videoURL = `length: ${options.videoURL.length}`
  // delete local.results

  const result = [
    `${config.name} - ${config.version}`,
    date.toString(),
    navigator.userAgent,
    `id: ${chrome.runtime.id}`,
    `permissions.origins: ${JSON.stringify(permissions.origins)}`,
    `options: ${JSON.stringify(options)}`,
    `local: ${JSON.stringify(local)}`,
    `language: ${chrome.i18n.getUILanguage()}`,
    `pinned: ${userSettings.isOnToolbar}`,
    `isFirefox: ${isFirefox}`,
    `isMobile: ${isMobile}`,
    `hosts: ${Object.keys(hosts).length}`,
  ]
  const commands = await chrome.commands?.getAll()
  if (commands) result.push(`commands: ${JSON.stringify(commands)}`)
  await navigator.clipboard.writeText(result.join('\n'))
  showToast(props.message)
}
</script>

<template>
  <p>
    <a id="copy-support" href="#" @click.prevent="copySupport"><slot /></a>
    <i v-if="!isMobile" class="fa-solid fa-circle-info ms-2" data-bs-toggle="tooltip" :data-bs-title="tip" v-bs></i>
  </p>
</template>
