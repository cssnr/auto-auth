<script setup lang="ts">
import { i18n } from '#imports'
import ToastAlerts from '@/components/ToastAlerts.vue'
import BackToTop from '@/components/BackToTop.vue'
import PanelHeader from '@/components/PanelHeader.vue'
import PermsCheck from '@/components/PermsCheck.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import HostsTable from '@/components/HostsTable.vue'
import AddHostButton from '@/components/AddHostButton.vue'
import ImportText from '@/components/ImportText.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'
import OpenOptionsBtn from '@/components/OpenOptionsBtn.vue'
</script>

<template>
  <header class="flex-shrink-0">
    <PanelHeader :side-button="false" />
  </header>

  <main class="flex-grow-1 overflow-auto p-1">
    <div class="d-grid gap-2">
      <PermsCheck />
      <div class="d-grid gap-2 d-sm-flex">
        <AddHostButton class="flex-sm-fill text-truncate" />
        <ImportText class="flex-sm-fill text-truncate" />
      </div>
      <HostsTable />
      <HorizontalRule>{{ i18n.t('options.extension') }}</HorizontalRule>
      <OptionsForm :close-window="true" :compact="true" :show="['switches', 'background']" />

      <OpenOptionsBtn>{{ i18n.t('popup.moreOptions') }}</OpenOptionsBtn>
    </div>
  </main>

  <!--<footer class="flex-shrink-0">-->
  <!--  <PanelFooter />-->
  <!--</footer>-->

  <ToastAlerts />
  <BackToTop />
</template>
