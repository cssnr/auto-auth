<script setup lang="ts">
import { i18n } from '#imports'
</script>

<template>
  <div class="dropdown">
    <a
      class="link-body-emphasis text-decoration-none"
      id="bs-theme-dropdown"
      :title="i18n.t('theme.title')"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fa-solid fa-circle-half-stroke fa-lg theme-icon" style="min-width: 20px"></i>
      <i class="fa-solid fa-caret-down fa-xs mx-1"></i
    ></a>
    <ul class="dropdown-menu auto dropdown-menu-end" aria-labelledby="bs-theme-dropdown">
      <li>
        <button class="dropdown-item" data-bs-theme-value="dark" aria-pressed="false">
          <i class="fa-regular fa-moon" style="min-width: 16px"></i>
          <span class="ms-3">{{ i18n.t('theme.dark') }}</span>
        </button>
      </li>
      <li>
        <button class="dropdown-item" data-bs-theme-value="light" aria-pressed="false">
          <i class="fa-solid fa-sun" style="min-width: 16px"></i>
          <span class="ms-3">{{ i18n.t('theme.light') }}</span>
        </button>
      </li>
      <li>
        <button class="dropdown-item" data-bs-theme-value="auto" aria-pressed="false">
          <i class="fa-solid fa-circle-half-stroke" style="min-width: 16px"></i>
          <span class="ms-3">{{ i18n.t('theme.auto') }}</span>
        </button>
      </li>
    </ul>
  </div>
  <!-- dropdown -->
</template>
