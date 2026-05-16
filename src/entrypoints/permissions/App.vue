<script setup lang="ts">
import { i18n } from '#imports'
import { onMounted, onUnmounted } from 'vue'
import { openOptions } from '@/utils/extension.ts'
import { useTitle } from '@/composables/useTitle.ts'
import BackToTop from '@/components/BackToTop.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import ToastAlerts from '@/components/ToastAlerts.vue'
import PageFooter from '@/components/PageFooter.vue'
import PageHeader from '@/components/PageHeader.vue'
import { isFirefox } from '@/utils/system.ts'

useTitle(i18n.t('permissions.title'))

async function onAdded() {
  if (document.hasFocus()) {
    await chrome.runtime.openOptionsPage()
    window.close()
  }
}

onMounted(() => chrome.permissions.onAdded.addListener(onAdded))
onUnmounted(() => chrome.permissions.onAdded.removeListener(onAdded))
</script>

<template>
  <div class="container-fluid p-3 h-100">
    <div class="d-flex align-items-center h-100">
      <div class="col-xl-6 col-md-8 col-12 m-auto">
        <div class="card p-3 text-center">
          <PageHeader />

          <PermsCheck :show-alert="true" class="my-2" />

          <p class="lead">{{ i18n.t('permissions.reason') }}</p>
          <p>
            {{ i18n.t('perms.moreInfo') }}
            <a
              v-if="isFirefox"
              href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onAuthRequired"
              target="_blank"
              rel="noopener"
              >{{ i18n.t('perms.mdn') }}</a
            >
            <a
              v-else
              href="https://developer.chrome.com/docs/extensions/reference/api/webRequest#event-onAuthRequired"
              target="_blank"
              rel="noopener"
              >{{ i18n.t('perms.chrome') }}</a
            >.
          </p>

          <a class="btn btn-lg btn-outline-info w-100 mb-3" href="/options.html" @click.prevent="openOptions()">
            <i class="fa-solid fa-sliders me-1"></i> {{ i18n.t('ctx.openOptions') }}</a
          >

          <hr class="mt-0" />

          <PageFooter />
        </div>
      </div>
    </div>
  </div>

  <ToastAlerts />
  <BackToTop />
</template>
