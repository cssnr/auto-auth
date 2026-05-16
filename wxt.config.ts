import { defineConfig } from 'wxt'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import * as cheerio from 'cheerio'

// https://github.com/cheeriojs/cheerio
function recolor(svg: string, stops: [string, string]) {
  const $ = cheerio.load(svg, { xmlMode: true })
  // noinspection CssInvalidHtmlTagReference
  const stop = $('linearGradient#grad stop')
  stop.eq(0).attr('stop-color', stops[0])
  stop.eq(1).attr('stop-color', stops[1])
  return $.xml()
}

// https://github.com/lovell/sharp
async function generateIcons(outDir: string) {
  console.log('generateIcons:', outDir)
  const iconsDir = join(outDir, 'icons')
  mkdirSync(iconsDir, { recursive: true })

  const source = 'src/assets/icon.svg'
  const sizes = [16, 24, 32, 48, 96, 128]
  const variants: Record<string, [string, string]> = {
    green: ['#32fc7d', '#089147'],
    red: ['#fc3232', '#e0100f'],
    yellow: ['#fcd632', '#d4a800'],
  }

  const svg = readFileSync(source, 'utf-8')
  for (const [name, stops] of Object.entries(variants)) {
    const modified = Buffer.from(recolor(svg, stops))
    for (const size of sizes) {
      const path = join(iconsDir, `${name}${size}.png`)
      console.log('path:', path)
      await sharp(modified).resize(size, size).png().toFile(path)
    }
  }
}

// See https://wxt.dev/api/config.html
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue', '@wxt-dev/i18n/module', '@wxt-dev/auto-icons'],

  // https://wxt.dev/guide/essentials/config/auto-imports.html#disabling-auto-imports
  // imports: false,

  autoIcons: {
    enabled: true,
    baseIconPath: 'assets/icon.svg',
    developmentIndicator: false,
    // developmentIndicator: 'overlay',
    sizes: [96, 24], // Dfault: 128, 48, 32, 16
  },

  // https://wxt.dev/guide/essentials/config/manifest.html
  manifest: ({ browser, mode }) => {
    const isFirefox = browser === 'firefox'
    const isDev = mode === 'development'
    console.log(`isDev: ${isDev} - isFirefox: ${isFirefox}`)

    return {
      default_locale: 'en',
      name: '__MSG_name__',
      short_name: '__MSG_short_name__',
      description: '__MSG_description__',
      homepage_url: 'https://github.com/cssnr/auto-auth',

      permissions: ['contextMenus', 'storage', 'webRequest', 'webRequestAuthProvider'],
      host_permissions: ['*://*/*'],

      commands: {
        _execute_action: {
          description: '__MSG_cmd_executeAction__',
          suggested_key: { default: 'Alt+Shift+A' },
        },
        openSidePanel: {
          description: '__MSG_cmd_openSidePanel__',
          suggested_key: { default: 'Alt+Shift+P' },
        },
        openExtPanel: {
          description: '__MSG_cmd_openExtPanel__',
          ...(!isDev && { suggested_key: { default: 'Alt+Shift+W' } }),
        },
        openOptions: {
          description: '__MSG_cmd_openOptions__',
          suggested_key: { default: 'Alt+Shift+O' },
        },
      },

      ...(isFirefox
        ? {
            browser_specific_settings: {
              gecko: {
                id: 'auto-auth@cssnr.com',
                strict_min_version: '128.0', // webRequest.onAuthRequired asyncBlocking
                data_collection_permissions: { required: ['none'] },
              },
              gecko_android: { strict_min_version: '128.0' }, // webRequest.onAuthRequired asyncBlocking
            },
          }
        : { minimum_chrome_version: '127' }), // chrome.action.openPopup
    }
  },

  // https://wxt.dev/guide/essentials/config/hooks
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      // console.log('build:manifestGenerated:', wxt.config.browser)
      if (manifest.action) manifest.action.default_icon = manifest.icons
      if (manifest.sidebar_action) manifest.sidebar_action.default_icon = manifest.icons
    },
    'build:done': async (wxt) => {
      // console.log('build:done:', wxt.config.outDir)
      await generateIcons(wxt.config.outDir)
    },
  },

  // // https://wxt.dev/guide/essentials/config/browser-startup.html
  // // NOTE: Configured in web-ext.config.ts
  // webExt: { disabled: true },

  // https://wxt.dev/guide/essentials/config/vite.html
  vite: () => ({
    // NOTE: This silences bootstrap deprecation warnings
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
          ],
        },
      },
    },
  }),
})
