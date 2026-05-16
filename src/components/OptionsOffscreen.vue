<script setup lang="ts">
import { i18n } from '#imports'
import { useId } from 'vue'
import { openOptions } from '@/utils/extension.ts'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import OptionsForm from '@/components/OptionsForm.vue'

const id = useId()
</script>

<template>
  <button
    id="toggle-button"
    class="btn btn-primary opacity-75"
    type="button"
    data-bs-toggle="offcanvas"
    :data-bs-target="`#${id}-offcanvas`"
    :aria-controls="`${id}-offcanvas`"
  >
    <i class="fa-solid fa-gears"></i>
  </button>

  <div class="offcanvas offcanvas-start glass" tabindex="-1" :id="`${id}-offcanvas`" :aria-labelledby="`${id}-label`">
    <div class="offcanvas-header">
      <ThemeSwitch />
      <h5 class="offcanvas-title ms-2" :id="`${id}-label`">{{ i18n.t('options.title') }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        :aria-label="i18n.t('ui.action.close')"
      ></button>
    </div>
    <div class="offcanvas-body p-2">
      <OptionsForm :compact="true" />

      <div class="p-3">
        <a class="btn btn-outline-info w-100" href="/options.html" @click.prevent="openOptions()">
          <i class="fa-solid fa-sliders me-2"></i> {{ i18n.t('popup.moreOptions') }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
#toggle-button {
  position: fixed;
  bottom: 40px;
  /*right: 0;*/
  z-index: 3;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
</style>
