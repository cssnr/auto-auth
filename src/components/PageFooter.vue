<script setup lang="ts">
import { i18n, useAppConfig } from '#imports'
import { clickOpen } from '@/utils/extension.ts'

withDefaults(
  defineProps<{
    homePage?: boolean
    requestFeature?: boolean
    openIssue?: boolean
  }>(),
  {
    homePage: true,
    requestFeature: true,
    openIssue: true,
  },
)

const config = useAppConfig()
</script>

<template>
  <div class="text-center">
    <a
      v-if="homePage"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="config.githubUrl"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.homePage') }}</a
    >
    <span class="mx-2 mx-md-3">&bull;</span>
    <a
      v-if="requestFeature"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.githubUrl}/issues/new?template=1-feature.yaml`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.requestFeature') }}</a
    >
    <span class="mx-2 mx-md-3">&bull;</span>
    <a
      v-if="openIssue"
      class="link-body-emphasis text-decoration-none d-inline-block"
      rel="noopener"
      :href="`${config.githubUrl}/issues`"
      target="_blank"
      @click.prevent="clickOpen"
      >{{ i18n.t('ui.text.openIssue') }}</a
    >
  </div>
</template>
