<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, ref } from 'vue'
import { isFirefox } from '@/utils/system.ts'
import { clickOpen } from '@/utils/extension.ts'
import HorizontalRule from '@/components/HorizontalRule.vue'

defineProps<{
  hideHeading?: boolean
  hideLink?: boolean
  linkMt?: string
}>()

const hasCommands = ref<boolean>(!!chrome.commands)
const commands = ref<{ description: string; shortcut: string; name: string }[]>([])

const openChromeShortcuts = () => chrome.tabs.update({ url: 'chrome://extensions/shortcuts' })

onMounted(async () => {
  if (!hasCommands.value) return
  const notSet = i18n.t('keyboard.notSet')
  const result = await chrome.commands.getAll()
  commands.value = result.map(({ description, name, shortcut }) => ({
    description: description || (name === '_execute_action' ? i18n.t('cmd.executeAction') : notSet),
    shortcut: shortcut || notSet,
    name: name || crypto.randomUUID(),
  }))
})
</script>

<template>
  <div v-if="hasCommands">
    <HorizontalRule v-if="!hideHeading" class="my-2">{{ i18n.t('keyboard.shortcuts') }}</HorizontalRule>
    <div class="rounded rounded-3 overflow-hidden">
      <table class="table table-sm rounded table-borderless table-hover transparent-table mb-0">
        <caption class="visually-hidden">
          {{
            i18n.t('keyboard.shortcuts')
          }}
        </caption>
        <thead class="visually-hidden">
          <tr>
            <th>{{ i18n.t('keyboard.description') }}</th>
            <th>{{ i18n.t('keyboard.shortcut') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cmd in commands" :key="cmd.name">
            <td class="ps-2 text-truncate w-100" style="max-width: 0">
              <i class="fa-regular fa-keyboard me-1"></i>
              {{ cmd.description }}
            </td>
            <td class="text-end pe-2 text-nowrap">
              <kbd>{{ cmd.shortcut }}</kbd>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!hideLink" :class="linkMt || `mt-2`">
      {{ i18n.t('keyboard.manage') }}:
      <a
        v-if="isFirefox"
        class="text-decoration-none d-inline-block firefox"
        href="https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox"
        target="_blank"
        rel="noopener"
        @click.prevent="clickOpen"
      >
        https://mzl.la/3Qwp5QQ
        <i class="fa-solid fa-arrow-up-right-from-square fa-xs"></i
      ></a>
      <a
        v-if="!isFirefox"
        id="chrome-shortcuts"
        class="d-inline-block chrome"
        role="button"
        @click="openChromeShortcuts"
        >chrome://extensions/shortcuts</a
      >
    </div>
  </div>
</template>

<!--<style scoped>-->
<!--#table td:first-child {-->
<!--  width: 100%;-->
<!--  max-width: 0;-->
<!--}-->
<!--table {-->
<!--  border-collapse: separate;-->
<!--}-->
<!--</style>-->
