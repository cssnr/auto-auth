<script setup lang="ts">
import { i18n } from '#imports'
import { ref } from 'vue'
import { submitHost } from '@/utils/index.ts'
import HostModal from '@/components/HostModal.vue'

defineOptions({
  inheritAttrs: false,
})

const hostModal = ref<InstanceType<typeof HostModal> | null>(null)
</script>

<template>
  <button v-bind="$attrs" class="btn btn-success" @click="hostModal?.show()">
    <i class="fa-solid fa-table-cells-row-lock me-2"></i> {{ i18n.t('ui.action.addCredentials') }}
  </button>

  <HostModal ref="hostModal" @submit="submitHost" />
</template>
