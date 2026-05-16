<script setup lang="ts">
import { i18n, useAppConfig } from '#imports'
import { clickOpen } from '@/utils/extension.ts'

const config = useAppConfig()
</script>

<template>
  <div class="d-flex flex-row justify-content-center align-items-center">
    <img src="@/assets/icon.svg" class="me-1" height="48" width="48" :alt="config.name" :title="config.name" />
    <div>
      <a
        class="link-body-emphasis text-decoration-none fs-1"
        :title="i18n.t('ui.text.homePage')"
        :href="config.githubUrl"
        target="_blank"
        rel="nofollow"
        @click.prevent="clickOpen"
      >
        {{ config.name }}</a
      >
      <a
        class="link-body-emphasis text-decoration-none small"
        :title="i18n.t('ui.text.releaseNotes')"
        :href="`${config.githubUrl}/releases/tag/${config.version}`"
        target="_blank"
        rel="nofollow"
        @click.prevent="clickOpen"
      >
        v<span class="version">{{ config.version }}</span></a
      >
    </div>
  </div>
</template>
