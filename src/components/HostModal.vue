<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, ref, useId, useTemplateRef } from 'vue'
import { Modal } from 'bootstrap'
import { debug } from '@/utils/logger.ts'
import { copyToast } from '@/utils/index.ts'
import { parseCreds } from '@/utils/creds.ts'
import { Hosts, validateHostname } from '@/utils/hosts.ts'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

defineExpose({ show })

const emit = defineEmits(['submit'])

const id = useId()

const modalEl = useTemplateRef('modalEl')
const modal = ref<Modal | any | null>(null) // any: to access modal._config

const hostnameEl = ref<HTMLInputElement | null>(null)
const usernameEl = ref<HTMLInputElement | null>(null)
const passwordEl = ref<HTMLInputElement | null>(null)

const originalHost = ref('')
const hostRef = ref('')
const userRef = ref('')
const passRef = ref('')

const hostInvalid = ref('')
const passInvalid = ref('')

const passwordShown = ref(false)
const unsavedChanges = ref(false)
const showAlert = ref(false)
const isAdding = ref(false)
const noUsername = ref(false)

function show(host?: string, creds?: string) {
  if (!modal.value) return console.error('no modalEl')

  if (host && creds) {
    originalHost.value = host
    hostRef.value = host
    const [username, password] = parseCreds(creds)
    userRef.value = username
    passRef.value = password
  } else {
    isAdding.value = true
  }

  modal.value.show()
}

function hide() {
  if (!modal.value) return console.error('no modalEl')
  modal.value.hide()
}

async function onSubmit() {
  debug('HostModal.vue - onSubmit:', hostRef.value, userRef.value, passRef.value, originalHost.value)

  // hostname
  const hostname = validateHostname(hostRef.value)
  if (!hostname) {
    hostnameEl.value?.focus()
    hostnameEl.value?.select()
    hostInvalid.value = i18n.t('ui.text.hostUrlInvalid')
    return
  }
  hostRef.value = hostname
  debug('hostname:', hostRef.value)

  // existing
  if (isAdding.value || hostRef.value !== originalHost.value) {
    const existing = await Hosts.get(hostRef.value)
    debug('existing:', existing)
    if (existing) {
      debug('Existing Host:', hostRef.value)
      hostnameEl.value?.focus()
      hostnameEl.value?.select()
      hostInvalid.value = i18n.t('ui.text.hostnameExists')
      return
    }
  }

  // username
  // NOTE: Consider validating username as a convince to the user...
  debug('username:', userRef.value)

  // password
  debug('password:', passRef.value)
  if (!passRef.value) {
    debug('No password')
    passwordEl.value?.focus()
    passInvalid.value = `${i18n.t('ui.text.password')} ${i18n.t('ui.text.password')}`
    return
  }

  emit('submit', hostRef.value, userRef.value, passRef.value, originalHost.value)
  hide()
}

function hostnameChange() {
  debug('HostModal.vue - hostnameChange')
  onceChange()
  if (!validateHostname(hostRef.value)) hostInvalid.value = i18n.t('ui.text.hostUrlInvalid')
  // NOTE: Add check for existing host with new hostRef.value, currently happens on submit
}

function onceChange() {
  debug('HostModal.vue - onceChange')
  if (!modal.value) return
  modal.value._config.backdrop = 'static'
  unsavedChanges.value = true
}

onMounted(() => {
  if (!modalEl.value) return
  modal.value = Modal.getOrCreateInstance(modalEl.value)

  modalEl.value?.addEventListener('shown.bs.modal', () => {
    if (isAdding.value) {
      hostnameEl.value?.focus()
    } else if (!userRef.value) {
      passwordEl.value?.focus()
      noUsername.value = true
    } else {
      usernameEl.value?.focus()
    }
  })

  modalEl.value?.addEventListener('hidePrevented.bs.modal', () => (showAlert.value = true))

  modalEl.value?.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })

  modalEl.value?.addEventListener('hidden.bs.modal', () => {
    originalHost.value = ''
    hostRef.value = ''
    userRef.value = ''
    passRef.value = ''
    hostInvalid.value = ''
    passInvalid.value = ''
    passwordShown.value = false
    unsavedChanges.value = false
    showAlert.value = false
    isAdding.value = false
    noUsername.value = false
    modal.value._config.backdrop = true
  })
})
</script>

<template>
  <Teleport to="body">
    <div ref="modalEl" class="modal fade" tabindex="-1" aria-labelledby="edit-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" :id="`${id}-edit-modal-label`">
              {{ isAdding ? i18n.t('ui.action.add') : i18n.t('ui.action.edit') }} {{ i18n.t('ui.text.host') }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :aria-label="i18n.t('ui.action.close')"
              tabindex="-1"
            ></button>
          </div>
          <div class="modal-body">
            <form :id="`${id}-edit-form`" name="edit-form" class="mb-3" autocomplete="off" @submit.prevent="onSubmit">
              <label :for="`${id}-hostname`" class="form-label" :class="{ 'visually-hidden': compact }"
                ><i class="fa-solid fa-globe me-2"></i> {{ i18n.t('ui.text.hostname') }}</label
              >
              <div class="input-group has-validation col-12 mb-3">
                <input
                  v-model="hostRef"
                  ref="hostnameEl"
                  :id="`${id}-hostname`"
                  :placeholder="i18n.t('form.host.hostnamePlaceholder')"
                  :aria-describedby="`${id}-hostnameHelp hostnameValidation`"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': hostInvalid }"
                  autocomplete="off"
                  required
                  @input="hostInvalid = ''"
                  @change="hostnameChange"
                />
                <button
                  class="btn btn-outline-info"
                  type="button"
                  data-bs-toggle="tooltip"
                  tabindex="-1"
                  data-bs-placement="bottom"
                  data-bs-trigger="hover"
                  :data-bs-title="i18n.t('ui.text.copyHostname')"
                  @click="copyToast(hostRef, i18n.t('ui.action.hostnameCopied'))"
                  v-bs
                >
                  <i class="fa-solid fa-copy"></i>
                </button>
                <div :id="`${id}-hostnameValidation`" class="invalid-feedback">{{ hostInvalid }}</div>
              </div>
              <div class="form-text visually-hidden" :id="`${id}-hostnameHelp`">
                {{ i18n.t('form.host.hostnameHelp') }}
              </div>

              <label :for="`${id}-username`" class="form-label" :class="{ 'visually-hidden': compact }"
                ><i class="fa-solid fa-user me-2"></i> {{ i18n.t('ui.text.username') }}</label
              >
              <div class="input-group has-validation col-12 mb-3">
                <input
                  v-model="userRef"
                  ref="usernameEl"
                  :id="`${id}-username`"
                  :placeholder="i18n.t('form.host.usernamePlaceholder')"
                  :aria-describedby="`${id}-usernameHelp usernameValidation`"
                  type="text"
                  class="form-control"
                  autocomplete="off"
                  :required="!noUsername"
                  @change="onceChange"
                />
                <button
                  class="btn btn-outline-info"
                  type="button"
                  data-bs-toggle="tooltip"
                  tabindex="-1"
                  data-bs-placement="bottom"
                  data-bs-trigger="hover"
                  :data-bs-title="i18n.t('ui.text.copyUsername')"
                  @click="copyToast(userRef, i18n.t('ui.action.usernameCopied'))"
                  v-bs
                >
                  <i class="fa-solid fa-copy"></i>
                </button>
                <div :id="`${id}-usernameValidation`" class="invalid-feedback"></div>
              </div>
              <div class="form-text visually-hidden" :id="`${id}-usernameHelp`">
                {{ i18n.t('form.host.usernameHelp') }}
              </div>
              <div class="form-check form-switch ms-2 mb-3">
                <input
                  v-model="noUsername"
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :id="`${id}-usernameSwitch`"
                  tabindex="-1"
                />
                <label class="form-check-label" :for="`${id}-usernameSwitch`">{{ i18n.t('auth.noUsername') }}</label>
              </div>

              <label :for="`${id}-password`" class="form-label" :class="{ 'visually-hidden': compact }"
                ><i class="fa-solid fa-key me-2"></i> {{ i18n.t('ui.text.password') }}</label
              >
              <div class="input-group has-validation col-12 mb-3">
                <input
                  v-model="passRef"
                  ref="passwordEl"
                  :id="`${id}-password`"
                  :placeholder="i18n.t('form.host.passwordPlaceholder')"
                  :aria-describedby="`${id}-passwordHelp passwordValidation`"
                  :type="passwordShown ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': passInvalid }"
                  autocomplete="off"
                  required
                  @input="passInvalid = ''"
                  @change="onceChange"
                />
                <button
                  class="btn"
                  :class="passwordShown ? 'btn-warning' : 'btn-outline-success'"
                  type="button"
                  data-bs-toggle="tooltip"
                  tabindex="-1"
                  data-bs-placement="bottom"
                  data-bs-trigger="hover"
                  :data-bs-title="i18n.t('ui.text.showHidePassword')"
                  @click.prevent="() => (passwordShown = !passwordShown)"
                  v-bs
                >
                  <i class="fa-regular fa-eye"></i>
                </button>
                <button
                  class="btn btn-outline-info"
                  type="button"
                  data-bs-toggle="tooltip"
                  tabindex="-1"
                  data-bs-placement="bottom"
                  data-bs-trigger="hover"
                  :data-bs-title="i18n.t('ui.text.copyPassword')"
                  @click="copyToast(passRef, i18n.t('ui.action.passwordCopied'))"
                  v-bs
                >
                  <i class="fa-solid fa-copy"></i>
                </button>
                <div :id="`${id}-passwordValidation`" class="invalid-feedback">{{ passInvalid }}</div>
              </div>
              <div class="form-text visually-hidden" :id="`${id}-passwordHelp`">
                {{ i18n.t('form.host.passwordHelp') }}
              </div>
            </form>

            <div v-if="showAlert" class="alert alert-warning text-center p-2 mb-2" role="alert">
              {{ i18n.t('ui.text.unsavedChanges') }}
            </div>
          </div>

          <div class="modal-footer">
            <button type="submit" :form="`${id}-edit-form`" class="btn btn-success me-auto">
              <i :class="isAdding ? 'fa-solid fa-square-plus' : 'fa-regular fa-floppy-disk me-2'"></i>
              {{ isAdding ? i18n.t('ui.action.add') : i18n.t('ui.action.save') }}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ i18n.t('ui.action.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
