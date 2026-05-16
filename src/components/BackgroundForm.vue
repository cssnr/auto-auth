<script setup lang="ts">
import { i18n } from '#imports'
import { useOptions } from '@/composables/useOptions.ts'
import { saveKeyValue } from '@/utils/options.ts'

const options = useOptions()

// NOTE: This was ported from VanillaJS and may need refactoring
</script>

<template>
  <div>
    <form @change="saveKeyValue('radioBackground', options.radioBackground)">
      <div class="d-flex flex-column flex-md-row ms-1 ms-md-3">
        <div class="form-check form-check-inline mb-2 mb-md-0">
          <input
            v-model="options.radioBackground"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgNone"
            value="bgNone"
          />
          <label class="form-check-label" for="bgNone">
            <i class="fa-regular fa-square"></i> {{ i18n.t('background.none') }}
          </label>
        </div>

        <div class="form-check form-check-inline mb-2 mb-md-0">
          <input
            v-model="options.radioBackground"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgPicture"
            value="bgPicture"
          />
          <label class="form-check-label" for="bgPicture">
            <i class="fa-regular fa-image"></i> {{ i18n.t('background.picture') }}
          </label>
        </div>

        <div class="form-check form-check-inline mb-2">
          <input
            v-model="options.radioBackground"
            class="form-check-input"
            type="radio"
            name="radioBackground"
            id="bgVideo"
            value="bgVideo"
          />
          <label class="form-check-label" for="bgVideo">
            <i class="fa-solid fa-video"></i> {{ i18n.t('background.video') }}
          </label>
        </div>
      </div>
    </form>

    <div class="ms-0 ms-md-3">
      <div v-if="options.radioBackground === 'bgPicture'" id="bgPictureInput" class="input-group">
        <span
          class="input-group-text"
          id="picture-addon"
          data-bs-toggle="tooltip"
          :data-bs-title="i18n.t('background.pictureTip')"
          v-bs
        >
          <i class="fa-solid fa-circle-info"></i
        ></span>
        <input
          v-model="options.pictureURL"
          type="text"
          class="form-control"
          :placeholder="i18n.t('background.pictureLabel')"
          :aria-label="i18n.t('background.pictureLabel')"
          id="pictureURL"
          name="pictureURL"
          aria-describedby="picture-addon"
          @change="saveKeyValue('pictureURL', options.pictureURL)"
        />
      </div>
      <div v-if="options.radioBackground === 'bgVideo'" id="bgVideoInput" class="input-group">
        <span
          class="input-group-text"
          id="video-addon"
          data-bs-toggle="tooltip"
          :data-bs-title="i18n.t('background.videoTip')"
          v-bs
        >
          <i class="fa-solid fa-circle-info"></i
        ></span>
        <input
          v-model="options.videoURL"
          type="text"
          class="form-control"
          :placeholder="i18n.t('background.videoLabel')"
          :aria-label="i18n.t('background.videoLabel')"
          id="videoURL"
          name="videoURL"
          aria-describedby="video-addon"
          @change="saveKeyValue('videoURL', options.videoURL)"
        />
      </div>
    </div>
  </div>
</template>
