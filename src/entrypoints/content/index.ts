import { i18n } from '#imports'
import { defineContentScript } from 'wxt/utils/define-content-script'
import { Hosts } from '@/utils/hosts.ts'

// TODO: Logging

let url: URL
let tabEnabled = false
let lastCreds: string | undefined

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    // console.log('%cContent Script Loaded:', 'color: MediumSeaGreen', chrome.runtime.id)

    url = new URL(window.location.href)

    if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
      // console.debug('Adding storage.onChanged Listener')
      chrome.storage.sync.onChanged.addListener(onChanged)
    }

    // // NOTE: Using Hosts.get since this is now bundled with vite...
    // chrome.runtime.sendMessage({ host: url.host }).then(processCreds).catch(console.error)
    Hosts.get(url.host).then(processCreds).catch(console.error)
  },
})

async function onChanged(changes: Record<string, any>) {
  // console.debug('content/index.ts - onChanged:', changes)
  // NOTE: Only these buckets can affect the current host (exact entries + wildcards)
  if (!(url.host[0] in changes) && !('*' in changes)) return
  const creds = await Hosts.get(url.host)
  if (creds === lastCreds) return
  await processCreds(creds)
}

async function processCreds(creds: any) {
  lastCreds = creds
  // console.debug('processCreds - tabEnabled:', tabEnabled, '- creds:', creds)
  try {
    if (creds) {
      tabEnabled = true
      if (creds === 'ignored') {
        console.log('%cIgnored - Site is Ignored!', 'color: Gold')
        await chrome.runtime.sendMessage({
          badgeText: i18n.t('content.badge.off'),
          badgeColor: 'yellow',
        })
      } else {
        console.log('%cEnabled - Site Credentials Found.', 'color: LimeGreen')
        await chrome.runtime.sendMessage({
          badgeText: i18n.t('content.badge.on'),
          badgeColor: 'green',
        })
      }
    } else if (tabEnabled) {
      console.log('%cDisabled - Site Credentials Removed.', 'color: Tomato')
      tabEnabled = false
      await chrome.runtime.sendMessage({ badgeText: '' })
    }
  } catch {
    // extension is reloaded, updated, or the page outlives the background script
  }
}
