<script setup lang="ts">
import { i18n } from '#imports'
import { nextTick, onMounted, ref, watch } from 'vue'
import { debug } from '@/utils/logger.ts'
import { copyToast } from '@/utils/index.ts'
import { parseCreds } from '@/utils/creds.ts'
import { openOptions } from '@/utils/extension.ts'
import { getSession, saveKeyValue } from '@/utils/options.ts'
import { useOptions } from '@/composables/useOptions.ts'
import { showToast } from '@/composables/useToast.ts'
import { Hosts } from '@/utils/hosts.ts'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import OptionsOffscreen from '@/components/OptionsOffscreen.vue'
import UseBackground from '@/components/UseBackground.vue'
import PageFooter from '@/components/PageFooter.vue'

const options = useOptions()

const userRef = ref('')
const passRef = ref('')
const hostRef = ref('')
const hrefRef = ref('')

const saveCreds = ref(false) // if credentials should be saved
const hasSavedCreds = ref(false)
const isFailure = ref(false)
const noUsername = ref(false)

const passwordShown = ref(false)
const usernameEl = ref<HTMLInputElement | null>(null)
const passwordEl = ref<HTMLInputElement | null>(null)

const ignoreModal = ref<HTMLElement | null>(null)
const isProcessing = ref(false)

watch(
  options,
  (opts) => {
    // NOTE: This runs once on loaded to set saveCreds but requires options to be set...
    const tempSave = sessionStorage.getItem(hostRef.value)
    debug('tempSave:', tempSave)
    saveCreds.value = tempSave ? !!Number.parseInt(tempSave) : opts.defaultSave
    watch(saveCreds, () => saveCredsChange())
  },
  { once: true },
)

async function submitAuth(event: Event) {
  debug('submitAuth:', event)
  isProcessing.value = true

  debug('hostRef.value:', hostRef.value)
  debug('userRef.value:', userRef.value)
  debug('passRef.value:', passRef.value)

  debug('saveCreds.value:', saveCreds.value)
  debug('options.value.defaultSave:', options.value.defaultSave)

  if (saveCreds.value) {
    await Hosts.set(hostRef.value, `${userRef.value}:${passRef.value}`)
    debug('%cCredentials Saved.', 'color: LimeGreen', `Loading: ${hrefRef.value}`)
  } else {
    const session = await getSession()
    debug('session:', session)
    session[hostRef.value] = `${userRef.value}:${passRef.value}`
    debug('session:', session)
    await chrome.storage.session.set({ session })
    debug('%cCredentials Saved for Session Only.', 'color: SpringGreen', `Loading: ${hrefRef.value}`)
  }
  await updateTab(hrefRef.value)
  isProcessing.value = false
}

async function ignoreHost() {
  debug('ignoreHost:', hostRef.value)
  await Hosts.set(hostRef.value, 'ignored')
  debug('%cHost Ignored:', 'color: Gold', hrefRef.value)
  // NOTE: This removes the page after the native login is shown
  document.body.remove()
  await updateTab(hrefRef.value)
}

async function updateTab(url: string) {
  const tab = await chrome.tabs.getCurrent()
  debug('tab:', tab)
  if (!tab?.id) return showToast(i18n.t('ui.text.errorLoadingPage'), 'danger')
  await chrome.tabs.update(tab.id, { url })
}

function saveCredsChange(event?: Event) {
  debug('saveCredsChange:', event)
  sessionStorage.setItem(hostRef.value, saveCreds.value ? '1' : '0')
}

onMounted(async () => {
  // NOTE: Copied from VanillaJS...
  const searchParams = new URLSearchParams(window.location.search)
  const fail = searchParams.get('fail')
  debug('fail:', fail)
  isFailure.value = !!fail
  const urlParam = searchParams.get('url')
  debug('urlParam:', urlParam)
  if (!urlParam) return

  const url = new URL(urlParam)
  debug('url:', url)
  hostRef.value = url.host
  hrefRef.value = url.href

  document.title = `${i18n.t('auth.title')} ${hostRef.value}`

  const creds = await Hosts.get(hostRef.value)
  debug('creds:', creds)

  const session = await getSession()
  debug('session:', session)

  if (creds) {
    debug('if creds:', creds)
    hasSavedCreds.value = true
    if (creds !== 'ignored') {
      const [username, password] = parseCreds(creds)
      userRef.value = username
      debug('usernameEl.value:', usernameEl.value)
      await nextTick()
      usernameEl.value?.select()
      passRef.value = password
    }
  } else if (hostRef.value in session) {
    debug('else hostRef.value in session:', hostRef.value)
    const [username, password] = parseCreds(session[hostRef.value])
    userRef.value = username
    debug('usernameEl.value:', usernameEl.value)
    await nextTick()
    usernameEl.value?.select()
    passRef.value = password
  }

  const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
  // debug('link:', link)
  if (!link) return
  link.href = `${url.origin}/favicon.ico`
  // debug('link.href:', link.href)
})
</script>

<template>
  <main class="flex-grow-1">
    <div class="container-fluid p-0 p-md-4">
      <div id="auth-outer" class="glass-outline rounded rounded-4 w-100 mx-auto p-1 p-md-3">
        <div class="text-center fs-4">
          <kbd
            class="text-ellipsis host"
            role="button"
            @click="copyToast(hostRef, i18n.t('ui.action.hostnameCopied'))"
            >{{ hostRef }}</kbd
          >
        </div>
        <div class="text-center mb-2 text-truncate">
          <i class="fa-regular fa-copy me-2" role="button" @click="copyToast(hrefRef, i18n.t('ui.action.urlCopied'))">
          </i>
          <a id="link" class="text-break" :href="hrefRef" target="_blank" rel="noopener">{{ hrefRef }}</a>
        </div>

        <div v-if="isFailure" id="fail" class="alert alert-warning text-center p-2 mb-2" role="alert">
          <b>{{ i18n.t('auth.authFailed') }}.</b> {{ ' ' }}
          <span class="d-none d-sm-inline">{{ i18n.t('auth.tryAgain') }}...</span>
        </div>

        <form id="auth-form" class="mb-3" autocomplete="off" @submit.prevent="submitAuth">
          <label for="username" class="form-label"
            ><i class="fa-solid fa-user me-2"></i>{{ i18n.t('ui.text.username') }}</label
          >
          <div class="input-group input-group-lg col-12">
            <input
              v-model="userRef"
              ref="usernameEl"
              id="username"
              :placeholder="i18n.t('form.host.usernamePlaceholder')"
              aria-describedby="usernameHelp"
              type="text"
              class="form-control"
              autocomplete="off"
              :required="!noUsername"
              autofocus
            />
          </div>
          <div class="form-text ms-2" id="usernameHelp">{{ i18n.t('form.host.usernameHelp') }}</div>
          <div class="form-check form-switch ms-2 mb-3">
            <input
              v-model="noUsername"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="usernameSwitch"
              tabindex="-1"
            />
            <label class="form-check-label" for="usernameSwitch">{{ i18n.t('auth.noUsername') }}</label>
          </div>

          <label for="password" class="form-label"
            ><i class="fa-solid fa-key me-2"></i> {{ i18n.t('ui.text.password') }}</label
          >
          <div class="input-group input-group-lg col-12">
            <input
              v-model="passRef"
              ref="passwordEl"
              id="password"
              :placeholder="i18n.t('form.host.passwordPlaceholder')"
              aria-describedby="passwordHelp"
              :type="passwordShown ? 'text' : 'password'"
              class="form-control"
              autocomplete="off"
              required
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
              data-class-on="btn-outline-warning"
              data-class-off="btn-outline-success"
              @click.prevent="() => (passwordShown = !passwordShown)"
              v-bs
            >
              <i class="fa-regular fa-eye"></i>
            </button>
          </div>
          <div class="form-text ms-2 mb-3" id="passwordHelp">{{ i18n.t('form.host.passwordHelp') }}</div>

          <div class="form-check form-switch fs-4 mb-3">
            <input
              v-model="saveCreds"
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="saveCreds"
              name="saveCreds"
              @change="saveCredsChange"
            />
            <label class="form-check-label" for="saveCreds">{{ i18n.t('auth.saveLogin') }}</label>
            <span v-if="!saveCreds" id="save-session" class="text-warning-emphasis fs-6 ms-2">
              <i class="fa-solid fa-circle-exclamation me-1"></i>
              {{ i18n.t('auth.credsNotSaved') }}
            </span>
          </div>

          <div v-if="!saveCreds && hasSavedCreds" class="alert alert-warning p-2">
            <i class="fa-solid fa-triangle-exclamation me-1"></i> {{ i18n.t('auth.credsAlreadySaved') }}
            <br />
            {{ i18n.t('auth.untilFixed') }}
            <a class="alert-link" href="/options.html" @click.prevent="openOptions()">{{
              i18n.t('auth.deleteSaved')
            }}</a>
            {{ i18n.t('ui.text.or') }}
            <a class="alert-link" role="button" @click="saveCreds = true">{{ i18n.t('auth.saveLogin') }}</a
            >.
          </div>

          <div v-if="options.tempDisabled" class="alert alert-danger p-2">
            <i class="fa-solid fa-triangle-exclamation me-1"></i>
            {{ i18n.t('ui.text.extensionDisabled') }}!
            {{ i18n.t('auth.useThe') }}
            <a class="alert-link" :href="hrefRef">{{ i18n.t('auth.nativeLogin') }}</a>
            {{ i18n.t('ui.text.or') }}
            <a class="alert-link" role="button" @click.prevent="saveKeyValue('tempDisabled', false)">{{
              i18n.t('auth.enableExtension')
            }}</a
            >.
          </div>

          <div class="row m-0">
            <div class="col-12 col-md-6 mb-2 mb-md-0">
              <button
                class="btn btn-lg w-100"
                :class="{
                  'btn-danger': options.tempDisabled,
                  'btn-success': !options.tempDisabled,
                  'btn-warning': !saveCreds && hasSavedCreds,
                  disabled: isProcessing,
                }"
                type="submit"
              >
                {{ i18n.t('auth.login') }}
                <i
                  ref="loginIcon"
                  class="fa-solid ms-2"
                  :class="isProcessing ? 'fa-sync fa-spin' : 'fa-right-to-bracket'"
                ></i>
              </button>
            </div>
            <div class="col-12 col-md-6">
              <button
                class="btn btn-lg btn-outline-warning w-100"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#ignore-modal"
              >
                {{ i18n.t('auth.ignoreHost') }}
                <i class="fa-solid fa-ban ms-2"></i>
              </button>
            </div>
          </div>
        </form>

        <hr class="my-2 my-md-3" />

        <PageFooter />
      </div>
    </div>
  </main>

  <div
    ref="ignoreModal"
    id="ignore-modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="ignore-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ignore-modal-label">{{ i18n.t('auth.ignore.confirmIgnore') }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            :aria-label="i18n.t('ui.action.close')"
            tabindex="-1"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('auth.ignore.ignoreHost') }}</p>
          <p class="text-center">
            <kbd class="ms-2">{{ hostRef }}</kbd>
          </p>
          <p class="mb-0">
            {{ i18n.t('auth.ignore.ignoreRemoved') }}
            <a href="/options.html" @click.prevent="openOptions()">{{ i18n.t('auth.ignore.optionsPage') }}</a
            >.
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning me-auto" @click.prevent="ignoreHost">
            <i class="fa-solid fa-ban ms-2"></i> {{ i18n.t('auth.ignore.confirmIgnore') }}
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ i18n.t('ui.action.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--<HostsOffscreen />-->
  <OptionsOffscreen />

  <ToastAlerts />
  <BackToTop />
  <UseBackground />
</template>

<style scoped>
#auth-outer {
  max-width: 767px;
}
</style>
