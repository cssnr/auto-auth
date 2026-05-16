import { getAppConfig } from '#imports'
import { defineBackground } from 'wxt/utils/define-background'
import { isFirefox } from '@/utils/system.ts'
import { debug } from '@/utils/logger.ts'
import { type Options, defaultOptions, getOptions } from '@/utils/options.ts'
import { openExtPanel, openPopup, openSidePanel } from '@/utils/extension.ts'
import { onAuthRequired, webRequestFinished } from './auth.ts'
import { updateIcon } from './icons.ts'
import { updateContextMenus } from './menus.ts'

const config = getAppConfig()
const banner = `%c\
   .---.  ${config.name}  v${config.version}
 //    |\\________________
ooo()  | ________   _   _)
 \\\\    |/        | | | |
   \`---'         "-" |_| 
%c${config.githubUrl}`

export default defineBackground(() => {
  // console.log(`Loaded: %c${chrome.runtime.id}`, 'Color: PaleGreen')
  console.log(banner, 'color: MediumSeaGreen', 'color: MediumSlateBlue')

  chrome.runtime.onInstalled.addListener(onInstalled)
  chrome.runtime.onStartup.addListener(onStartup)
  chrome.storage.sync.onChanged.addListener(onChanged)
  chrome.runtime.onMessage.addListener(onMessage)
  chrome.commands?.onCommand.addListener(onCommand)
  chrome.contextMenus?.onClicked.addListener(onClicked)

  chrome.permissions.onAdded.addListener(onAdded)
  chrome.permissions.onRemoved.addListener(onRemoved)

  const filter = { urls: ['<all_urls>'] }
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onAuthRequired
  chrome.webRequest.onAuthRequired.addListener(onAuthRequired, filter, ['asyncBlocking'])
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onCompleted
  chrome.webRequest.onCompleted.addListener(webRequestFinished, filter)
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onErrorOccurred
  chrome.webRequest.onErrorOccurred.addListener(webRequestFinished, filter)
})

async function onInstalled(details: chrome.runtime.InstalledDetails) {
  debug('onInstalled:', details)

  const options = await setDefaultOptions(defaultOptions)
  debug('options:', options)
  updateIcon(options).catch(console.warn)
  updateContextMenus(options.contextMenu).catch(console.warn)
  setUninstall().catch(console.warn)

  const manifest = chrome.runtime.getManifest()

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // NOTE: origins defined: background/icons.ts, components/PermsCheck.vue
    const hasPerms = await chrome.permissions.contains({
      origins: manifest.host_permissions,
    })
    debug('hasPerms:', hasPerms)
    if (hasPerms) {
      await chrome.runtime.openOptionsPage()
    } else {
      const url = chrome.runtime.getURL('permissions.html')
      await chrome.tabs.create({ active: true, url })
    }
  } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    if (options.showUpdate && manifest.version !== details.previousVersion) {
      // const config = getAppConfig()
      const url = `${config.githubUrl}/releases/tag/${manifest.version}`
      await chrome.tabs.create({ active: false, url })
    }
  }
}

async function onStartup() {
  debug('onStartup')

  const options = await getOptions()
  debug('options:', options)
  updateIcon(options).catch(console.warn)

  if (isFirefox) {
    debug('Firefox Startup Workarounds')
    updateContextMenus(options.contextMenu).catch(console.warn)
    setUninstall().catch(console.warn)
  }
}

function onChanged(changes: Record<string, chrome.storage.StorageChange>) {
  // debug('background/index.ts - onChanged:', changes)
  if (changes?.options) {
    const oldValue = changes.options?.oldValue as Options | undefined
    const newValue = changes.options?.newValue as Options | undefined
    if (!oldValue || !newValue) return debug('missing oldValue or newValue')
    if (oldValue?.contextMenu !== newValue.contextMenu) {
      updateContextMenus(newValue.contextMenu).catch(console.warn)
    }
    if (oldValue.tempDisabled !== newValue.tempDisabled) {
      updateIcon(newValue).catch(console.warn)
    }
  }
}

function onMessage(message: any, sender: chrome.runtime.MessageSender) {
  const tabId = message.tabId || sender.tab?.id
  debug(`background/index.ts - onMessage: tabId: ${tabId} - message:`, message)
  if (!message || typeof message !== 'object') {
    return console.warn('invalid message:', message)
  }
  if (tabId && Object.hasOwn(message, 'badgeColor')) {
    debug(`setBadgeBackgroundColor: ${message.badgeColor}`)
    chrome.action
      .setBadgeBackgroundColor({ tabId: tabId, color: message.badgeColor })
      .catch(console.warn)
  }
  if (tabId && Object.hasOwn(message, 'badgeText')) {
    debug(`setBadgeText: ${message.badgeText}`)
    chrome.action
      .setBadgeText({ tabId: tabId, text: message.badgeText })
      .catch(console.warn)
  }
  // // NOTE: Using Hosts.get since this is now bundled with vite...
  // if (message.host) {
  //   Hosts.get(message.host).then((creds) => sendResponse(creds))
  //   return true
  // }
}

async function onCommand(command: string, tab?: chrome.tabs.Tab) {
  debug('onCommand:', command, tab)
  if (command === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (command === 'openExtPanel') {
    await openExtPanel()
  } else if (command === 'openSidePanel') {
    openSidePanel()
  } else {
    console.warn(`Unknown command: ${command}`)
  }
}

async function onClicked(ctx: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
  debug('onClicked:', ctx, tab)
  if (ctx.menuItemId === 'openOptions') {
    await chrome.runtime.openOptionsPage()
  } else if (ctx.menuItemId === 'openPopup') {
    await openPopup()
  } else if (ctx.menuItemId === 'openExtPanel') {
    await openExtPanel()
  } else if (ctx.menuItemId === 'openSidePanel') {
    openSidePanel()
  } else {
    console.warn(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
  }
}

export async function onAdded(permissions: chrome.permissions.Permissions) {
  debug('onAdded', permissions)
  await updateIcon()
}

export async function onRemoved(permissions: chrome.permissions.Permissions) {
  debug('onRemoved', permissions)
  await updateIcon()
}

async function setDefaultOptions(defaultOptions: object) {
  debug('setDefaultOptions', defaultOptions)
  const options = await getOptions()
  let changed = false
  for (const [key, value] of Object.entries(defaultOptions)) {
    // debug(`${key}: default: ${value} current: ${options[key]}`)
    if (options[key] === undefined) {
      changed = true
      options[key] = value
      debug(`Set %c${key}:`, 'color: Khaki', value)
    }
  }
  if (changed) {
    await chrome.storage.sync.set({ options })
    debug('chrome.storage.sync.set:', options)
  }
  return options
}

async function setUninstall() {
  // NOTE: Calling this setUninstallURL and using getAppConfig breaks WXT
  // const config = getAppConfig()
  const url = new URL(config.uninstallUrl)
  url.searchParams.append('version', config.version)
  url.searchParams.append('id', chrome.runtime.id)
  debug('setUninstallURL:', url.href)
  await chrome.runtime.setUninstallURL(url.href)
}
