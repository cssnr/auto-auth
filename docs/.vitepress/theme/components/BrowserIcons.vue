<script setup lang="ts">
import 'animate.css'

const props = defineProps({
  animation: String,
  size: { type: String, default: '48' }, // 16,24,32,48,64,128,256,512
  chrome: { type: String, required: true },
  firefox: { type: String, required: true },
})

// Browsers
const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1'
const browsers = [
  { name: 'Chrome', url: props.chrome, img: 'chrome/chrome' },
  { name: 'Firefox', url: props.firefox, img: 'firefox/firefox' },
  { name: 'Edge', url: props.chrome, img: 'edge/edge' },
  { name: 'Opera', url: props.chrome, img: 'opera/opera' },
  { name: 'Brave', url: props.chrome, img: 'brave/brave' },
  // { name: 'Chromium', url: props.chrome, img: 'chromium/chromium' },
]

const imageClass = props.animation ? `animate__animated ${props.animation}` : undefined
</script>

<template>
  <div class="browser-icons" :style="{ minHeight: `${props.size}px` }">
    <a
      v-for="browser in browsers"
      :key="browser.name"
      :href="browser.url"
      :title="browser.name"
      class="px-1 hvr-grow-lg"
      target="_blank"
      rel="noopener"
    >
      <img
        :alt="browser.name"
        :width="props.size"
        :height="props.size"
        :src="`${baseUrl}/${browser.img}_${props.size}x${props.size}.png`"
        :class="imageClass"
      />
    </a>
  </div>
</template>

<style scoped>
.browser-icons a {
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
  transform: translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  backface-visibility: hidden;
  -moz-osx-font-smoothing: grayscale;
  transition-duration: 0.3s;
  transition-property: transform;
}
.browser-icons a:hover {
  transform: scale(1.2);
}
</style>
