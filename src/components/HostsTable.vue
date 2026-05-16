<script setup lang="ts">
import { i18n } from '#imports'
import { computed, ref } from 'vue'
import { isMobile } from '@/utils/system.ts'
import { debug } from '@/utils/logger.ts'
import { submitHost } from '@/utils/index.ts'
import { parseCreds } from '@/utils/creds.ts'
import { saveKeyValue } from '@/utils/options.ts'
import { showToast } from '@/composables/useToast.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { useHosts } from '@/composables/useHosts.ts'
import { Hosts, validateHostname } from '@/utils/hosts.ts'
import DeleteModal from '@/components/DeleteModal.vue'
import HostModal from '@/components/HostModal.vue'
import ImportExport from '@/components/ImportExport.vue'
import InputCell from '@/components/InputCell.vue'

withDefaults(
  defineProps<{
    showImport?: boolean
  }>(),
  {
    showImport: true,
  },
)

const options = useOptions()
const hosts = useHosts()

const deleteModal = ref<InstanceType<typeof DeleteModal> | null>(null)
const hostModal = ref<InstanceType<typeof HostModal> | null>(null)

// provide('options', options)
// const options = inject<Ref<Options | undefined>>('options')

const computedHosts = computed(() =>
  Object.entries(hosts.value).map(([host, creds]) => {
    const [user, pass] = parseCreds(creds)
    return { host, creds, user, pass }
  }),
)

// DUPLICATION: popup/App.vue
function deleteClick(host: string) {
  debug('HostsTable.vue - deleteClick:', host)
  if (options.value.confirmDelete) {
    deleteModal.value?.show(host)
  } else {
    deleteHost(host)
  }
}

// DUPLICATION: popup/App.vue
async function deleteHost(host: string) {
  debug('HostsTable.vue - deleteHost:', host)
  // const creds = hosts.value[host]
  // debug('creds:', creds)
  try {
    await Hosts.delete(host)
    showToast(`${i18n.t('ui.text.removed')}: ${host}`, 'success')
  } catch (e) {
    const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
    showToast(`${i18n.t('ui.text.deleteHostError')}: ${message}`, 'danger')
  }
}

function onEdit(host: string, field: string, value: string) {
  debug('HostsTable.vue - onEdit:', host, field, value)
  const creds = hosts.value[host]
  debug('creds:', creds)
  if (!creds) return showToast(i18n.t('ui.text.noCredentialsImport'), 'warning')
  const [username, password] = parseCreds(creds)
  debug('username, password:', username, password)

  if (field === 'host' && value in hosts.value) return showToast(i18n.t('ui.text.hostnameExists'), 'warning')

  switch (field) {
    case 'host': {
      if (!value) {
        const message = `${i18n.t('ui.text.hostname')} ${i18n.t('ui.text.required')}`
        return showToast(message, 'warning')
      }
      const hostname = validateHostname(value)
      if (!hostname) {
        const message = `${i18n.t('ui.text.hostname')} ${i18n.t('ui.text.invalid')}`
        return showToast(message, 'warning')
      }
      return submitHost(hostname, username, password, host)
    }
    case 'user': {
      return submitHost(host, value, password, host)
    }
    case 'pass': {
      if (!value) {
        const message = `${i18n.t('ui.text.password')} ${i18n.t('ui.text.required')}`
        return showToast(message, 'warning')
      }
      return submitHost(host, username, value, host)
    }
    default: {
      return showToast(i18n.t('import.errorUnknown'), 'warning')
    }
  }
}

function onSubmit(host: string, user: string, pass: string, original?: string) {
  debug('onSubmit')

  if (host in hosts.value) {
    const creds = hosts.value[host]
    debug('creds:', creds)
    const [username, password] = parseCreds(creds)
    if (username == user && password == pass) return showToast(i18n.t('ui.text.noChanges'), 'warning')
  }

  submitHost(host, user, pass, original)
}

function columnsChange(event: Event) {
  debug('HostsTable.vue - columnsChange:', event)
  const target = event.target as HTMLInputElement
  debug('target.id:', target.id)
  debug('target.checked:', target.checked)
  saveKeyValue(target.id, target.checked)
}

const columnCount = computed(() => {
  let count = 3
  if (options.value.usernameShown) count++
  if (options.value.passwordShown) count++
  return count
})
</script>

<template>
  <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
    <div class="dropdown me-sm-auto mt-2 mt-sm-0">
      <a
        role="button"
        class="link-body-emphasis text-decoration-none d-inline-block"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
      >
        <i class="fa-solid fa-table-columns"></i> {{ i18n.t('form.host.columns') }}
      </a>

      <div class="dropdown-menu dropstart" :class="{ 'fs-5': isMobile }">
        <div class="form-check mx-2">
          <input
            v-model="options.largeTable"
            type="checkbox"
            class="form-check-input"
            id="largeTable"
            @change="saveKeyValue('largeTable', options.largeTable)"
          />
          <label class="form-check-label text-nowrap" for="largeTable">
            <i class="fa-solid fa-table-cells-large"></i> {{ i18n.t('form.host.large') }}
          </label>
        </div>
        <div class="form-check mx-2">
          <input
            v-model="options.clickEdit"
            type="checkbox"
            class="form-check-input"
            id="clickEdit"
            @change="saveKeyValue('clickEdit', options.clickEdit)"
          />
          <label class="form-check-label text-nowrap" for="clickEdit">
            <i class="fa-solid fa-arrow-pointer"></i> {{ i18n.t('form.host.editable') }}
          </label>
        </div>
        <form class="px-2" @change="columnsChange">
          <div class="form-check">
            <input v-model="options.usernameShown" type="checkbox" class="form-check-input" id="usernameShown" />
            <label class="form-check-label text-nowrap" for="usernameShown">
              <i class="fa-solid fa-at"></i> {{ i18n.t('ui.text.username') }}
            </label>
          </div>
          <div class="form-check ms-4">
            <input v-model="options.usernameVisible" type="checkbox" class="form-check-input" id="usernameVisible" />
            <label class="form-check-label text-nowrap" for="usernameVisible">
              <i class="fa-solid" :class="options.usernameVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
              {{ i18n.t('form.host.visible') }}
            </label>
          </div>
          <div class="form-check">
            <input v-model="options.passwordShown" type="checkbox" class="form-check-input" id="passwordShown" />
            <label class="form-check-label text-nowrap" for="passwordShown">
              <i class="fa-solid fa-key"></i> {{ i18n.t('ui.text.password') }}
            </label>
          </div>
          <div class="form-check ms-4">
            <input v-model="options.passwordVisible" type="checkbox" class="form-check-input" id="passwordVisible" />
            <label class="form-check-label text-nowrap" for="passwordVisible">
              <i class="fa-solid" :class="options.passwordVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
              {{ i18n.t('form.host.visible') }}
            </label>
          </div>
        </form>
      </div>
    </div>

    <ImportExport v-if="showImport" />
  </div>

  <div class="rounded rounded-3 overflow-hidden">
    <table
      id="history-table"
      class="table table-hover transparent-table"
      :class="{ 'table-sm': !options.largeTable }"
      style="table-layout: fixed"
    >
      <thead>
        <tr>
          <th class="text-center" style="width: 36px"><i class="fa-solid fa-trash-can"></i></th>
          <th class="text-truncate">{{ i18n.t('ui.text.hostname') }}</th>
          <th v-if="options.usernameShown" class="text-truncate">{{ i18n.t('ui.text.username') }}</th>
          <th v-if="options.passwordShown" class="text-truncate">{{ i18n.t('ui.text.password') }}</th>
          <th class="text-center" style="width: 36px"><i class="fa-solid fa-pen-to-square"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ host, creds, user, pass } in computedHosts" :key="host">
          <!-- Delete -->
          <td class="text-center">
            <a :title="i18n.t('ui.action.delete')" class="link-danger" role="button" @click.prevent="deleteClick(host)"
              ><i class="fa-regular fa-trash-can"></i
            ></a>
          </td>

          <!-- Host -->
          <td v-if="creds === 'ignored'" class="text-truncate text-warning-emphasis">
            {{ host }}
          </td>
          <template v-else>
            <td v-if="!options.clickEdit" class="text-truncate">
              <a :href="`https://${host}`" target="_blank" class="link-body-emphasis">{{ host }}</a>
            </td>
            <InputCell
              v-else
              :host="host"
              field="host"
              :value="host"
              :visible="true"
              :editable="options.clickEdit"
              @edit="onEdit"
            />
          </template>

          <!-- User -->
          <template v-if="options.usernameShown">
            <td v-if="creds === 'ignored'" class="text-truncate text-warning-emphasis fst-italic">
              {{ i18n.t('ui.text.ignored') }}
            </td>
            <InputCell
              v-else
              :host="host"
              field="user"
              :value="user"
              empty="None"
              :visible="options.usernameVisible"
              :editable="options.clickEdit"
              @edit="onEdit"
            />
          </template>

          <template v-if="options.passwordShown">
            <td v-if="creds === 'ignored'" class="text-truncate text-warning-emphasis fst-italic">
              {{ i18n.t('ui.text.ignored') }}
            </td>
            <InputCell
              v-else
              :host="host"
              field="pass"
              :value="pass"
              :visible="options.passwordVisible"
              :editable="options.clickEdit"
              @edit="onEdit"
            />
          </template>

          <!-- Edit -->
          <td class="text-center">
            <a
              :title="i18n.t('ui.action.edit')"
              class="link-warning"
              role="button"
              @click.prevent="hostModal?.show(host, creds)"
              ><i class="fa-solid fa-pen-to-square"></i
            ></a>
          </td>
        </tr>

        <tr v-if="!computedHosts.length">
          <td class="text-center text-warning-emphasis fst-italic" :colspan="columnCount">
            {{ i18n.t('ui.text.noSavedCreds') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <DeleteModal ref="deleteModal" @delete="deleteHost" />
  <HostModal ref="hostModal" @submit="onSubmit" />
</template>
