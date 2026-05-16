<script setup lang="ts">
import { i18n } from '#imports'
import { useOptions } from '@/composables/useOptions.ts'
import FormSwitch from '@/components/FormSwitch.vue'
import BackgroundForm from '@/components/BackgroundForm.vue'
import HorizontalRule from '@/components/HorizontalRule.vue'

withDefaults(
  defineProps<{
    show?: string[]
    switches?: string[]
  }>(),
  {
    show: () => ['switches', 'background'],
    switches: () => ['tempDisabled', 'ignoreProxy', 'defaultSave', 'confirmDelete', 'contextMenu', 'showUpdate'],
  },
)

const options = useOptions()
</script>

<template>
  <div class="d-flex flex-column gap-3 overflow-x-hidden">
    <div v-if="show.includes('switches')" class="row m-0">
      <form class="p-0">
        <template v-for="id in switches" :key="id">
          <FormSwitch :id="id" v-model="options[id]" />
          <Transition name="fade">
            <div v-show="id === 'tempDisabled' && options['tempDisabled']" class="alert alert-warning p-2 mb-2">
              <i class="fa-solid fa-triangle-exclamation me-2"></i> {{ i18n.t('ui.text.extensionDisabled') }}!
            </div>
          </Transition>
        </template>
      </form>
    </div>

    <div v-if="show.includes('background')">
      <HorizontalRule class="p-0 my-2">{{ i18n.t('options.authPageBackground') }}</HorizontalRule>
      <!--<h6>{{ i18n.t('options.authPageBackground') }}</h6>-->
      <BackgroundForm />
    </div>
  </div>
</template>
