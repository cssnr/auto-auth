import { i18n } from '#imports'
import { defineContentScript } from 'wxt/utils/define-content-script'
import { Hosts, findBestWildcardMatch } from '@/utils/hosts.ts'

// TODO: Logging

let url: URL
let tabEnabled = false

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
  const exactItems = changes[url.host[0]] // NOTE: Lazy Typing... in changes
  const wildcardItems = changes['*']

  if (!exactItems && !wildcardItems) return

  if (exactItems) {
    const oldCreds = exactItems.oldValue?.[url.host]
    const newCreds = exactItems.newValue?.[url.host]
    if (oldCreds !== newCreds) {
      // If exact match was removed, check if a wildcard still covers this host
      if (!newCreds) {
        const wildcard = findBestWildcardMatch(url.host, await Hosts.all())
        return await processCreds(wildcard)
      }
      return await processCreds(newCreds)
    }
  }

  if (wildcardItems) {
    const oldWildcard = findBestWildcardMatch(url.host, wildcardItems.oldValue)
    const newWildcard = findBestWildcardMatch(url.host, wildcardItems.newValue)
    if (oldWildcard !== newWildcard) await processCreds(newWildcard)
  }
}

async function processCreds(creds: any) {
  // console.debug('processCreds - tabEnabled:', tabEnabled, '- creds:', creds)
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
}
