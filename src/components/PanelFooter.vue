<script setup lang="ts">
import { i18n } from '#imports'
import { openOptions } from '@/utils/extension.ts'

const closeWindow = () => window.close()
</script>

<template>
  <div class="p-1 pt-0">
    <div class="d-flex flex-row justify-content-end gap-2">
      <a
        :title="i18n.t('ui.action.options')"
        class="btn btn-sm btn-outline-info hvr-grow-sm"
        href="/options.html"
        target="_blank"
        @click.prevent="openOptions()"
      >
        <i class="fa-solid fa-gears"></i> {{ i18n.t('ui.action.options') }}
      </a>
      <button
        :title="i18n.t('ui.action.close')"
        class="btn btn-sm btn-outline-warning hvr-grow-sm"
        @click="closeWindow()"
      >
        <i class="fa-regular fa-circle-xmark"></i> {{ i18n.t('ui.action.close') }}
      </button>
    </div>
  </div>
</template>
