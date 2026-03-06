// JS Exports

export const githubURL = 'https://github.com/cssnr/auto-auth'

// noinspection JSUnresolvedReference
export const isFirefox =
    typeof browser !== 'undefined' &&
    typeof browser?.runtime?.getBrowserInfo === 'function'

export class Hosts {
    /** @type {[String]} */
    static keys = [...'abcdefghijklmnopqrstuvwxyz0123456789']

    /**
     * @return {Promise<Object.<String, String>>}
     */
    static async all() {
        const sync = await chrome.storage.sync.get(Hosts.keys)
        return Object.assign({}, ...Object.values(sync))
    }

    /**
     * @param {String} host
     * @return {Promise<String>}
     */
    static async get(host) {
        const sync = await Hosts.#getSync(host)
        return sync[host]
    }

    /**
     * @param {String} host
     * @param {String} creds
     * @return {Promise<void>}
     */
    static async set(host, creds) {
        const sync = await Hosts.#getSync(host)
        sync[host] = creds
        await chrome.storage.sync.set({ [host[0]]: sync })
    }

    /**
     * @param {String} host
     * @return {Promise<void>}
     */
    static async delete(host) {
        const sync = await Hosts.#getSync(host)
        delete sync[host]
        await chrome.storage.sync.set({ [host[0]]: sync })
    }

    /**
     * @param {String} old
     * @param {String} host
     * @param {String} creds
     * @return {Promise<void>}
     */
    static async edit(old, host, creds) {
        if (old !== host) {
            await this.delete(old)
        }
        await this.set(host, creds)
    }

    /**
     * @param {Object} hosts
     * @return {Promise<void>}
     */
    static async update(hosts) {
        const sync = await chrome.storage.sync.get(Hosts.keys)
        for (const [key, value] of Object.entries(hosts)) {
            if (!(key[0] in sync)) {
                sync[key[0]] = {}
            }
            sync[key[0]][key] = value
        }
        await chrome.storage.sync.set(sync)
    }

    /**
     * @param {String} host
     * @return {Promise<Object.<String, String>>}
     */
    static async #getSync(host) {
        const sync = await chrome.storage.sync.get(host[0])
        return sync[host[0]] || {}
    }
}

/**
 * Text File Download
 * @function textFileDownload
 * @param {String} filename
 * @param {String} text
 */
export function textFileDownload(filename, text) {
    console.debug(`textFileDownload: ${filename}`)
    const element = document.createElement('a')
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
    )
    element.setAttribute('download', filename)
    element.classList.add('d-none')
    document.body.appendChild(element)
    element.click()
    element.remove()
}

export function showHidePassword(event) {
    console.debug('showHidePassword:', event)
    const el = event.currentTarget
    const input = document.querySelector(el.dataset.showHide)
    if (input.type === 'password') {
        input.type = 'text'
        el.classList.remove(el.dataset.classOff)
        el.classList.add(el.dataset.classOn)
    } else {
        input.type = 'password'
        el.classList.remove(el.dataset.classOn)
        el.classList.add(el.dataset.classOff)
    }
}

/**
 * @function copyInput
 * @param {MouseEvent} event
 * @return {Promise<void>}
 */
export async function copyInput(event) {
    console.debug('copyInput:', event)
    const el = event.currentTarget || event.target.closest('button')
    const input = document.querySelector(el.dataset.copyInput)
    console.debug('input:', input)
    if (!input.value) {
        showToast('No Data to Copy.', 'warning')
        return
    }
    await navigator.clipboard.writeText(input.value)
    if (el.dataset.copyText) {
        showToast(el.dataset.copyText, 'success')
    } else {
        showToast('Copied to Clipboard.', 'success')
    }
}

/**
 * Save Options Callback
 * @function saveOptions
 * @param {UIEvent} event
 */
export async function saveOptions(event) {
    console.debug('saveOptions:', event)
    const { options } = await chrome.storage.sync.get(['options'])
    let key = event.target.id
    let value
    if (event.target.type === 'radio') {
        key = event.target.name
        const radios = document.getElementsByName(key)
        for (const input of radios) {
            if (input.checked) {
                value = input.id
                break
            }
        }
    } else if (event.target.type === 'checkbox') {
        value = event.target.checked
    } else if (event.target.type === 'number') {
        const number = Number.parseFloat(event.target.value)
        let min = Number.parseFloat(event.target.min)
        let max = Number.parseFloat(event.target.max)
        if (!Number.isNaN(number) && number >= min && number <= max) {
            event.target.value = number.toString()
            value = number
        } else {
            event.target.value = options[event.target.id]
            return
        }
    } else {
        value = event.target.value
    }

    if (value === undefined) {
        console.warn(`No value for key: ${key}`)
    } else if (value === options[key]) {
        console.log(`No value change for key: ${key}:`, value)
    } else {
        options[key] = value
        console.log(`Set %c${key}:`, 'color: Khaki', value)
        await chrome.storage.sync.set({ options })
    }
}

/**
 * Update Options
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    console.debug('updateOptions:', options)
    for (let [key, value] of Object.entries(options)) {
        if (value === undefined) {
            console.warn('Value undefined for key:', key)
            continue
        }
        // Option Key should be `radioXXX` and values should be the option IDs
        if (key.startsWith('radio')) {
            key = value //NOSONAR
            value = true //NOSONAR
        }
        // console.debug(`${key}: ${value}`)
        const el = document.getElementById(key)
        if (!el) {
            continue
        }
        if (el.tagName !== 'INPUT') {
            el.textContent = value.toString()
        } else if (typeof value === 'boolean') {
            el.checked = value
        } else {
            el.value = value
        }
        if (el.dataset.related) {
            hideShowElement(`#${el.dataset.related}`, value)
        }
        if (el.dataset.warning) {
            el.nextElementSibling.classList.toggle(el.dataset.warning, !!value)
        }
    }
}

/**
 * Hide or Show Element with JQuery
 * @function hideShowElement
 * @param {String} selector
 * @param {Boolean} [show]
 * @param {String} [speed]
 */
function hideShowElement(selector, show, speed = 'fast') {
    const element = $(`${selector}`)
    // console.debug('hideShowElement:', show, element)
    if (show) {
        element.show(speed)
    } else {
        element.hide(speed)
    }
}

/**
 * Link Click Callback
 * Note: Firefox popup requires a call to window.close()
 * @function linkClick
 * @param {Event|MouseEvent} event
 * @param {Boolean} [close]
 */
export async function linkClick(event, close = false) {
    console.debug('linkClick:', close, event)
    const target = event.currentTarget
    const href = target.getAttribute('href').replace(/^\.+/, '')
    console.debug('href:', href)
    let url
    if (href.startsWith('#')) {
        console.debug('return on anchor link')
        return
    }
    event.preventDefault()
    if (href.endsWith('html/options.html')) {
        await chrome.runtime.openOptionsPage()
        if (close) window.close()
        return
    } else if (href.endsWith('html/panel.html')) {
        await showPanel()
        if (close) window.close()
        return
    } else if (href.startsWith('http')) {
        url = href
    } else {
        url = chrome.runtime.getURL(href)
    }
    console.debug('url:', url)
    await activateOrOpen(url)
    if (close) window.close()
}

/**
 * Activate or Open Tab from URL
 * @function activateOrOpen
 * @param {String} url
 * @param {Boolean} [open]
 * @return {Promise<chrome.tabs.Tab>}
 */
export async function activateOrOpen(url, open = true) {
    console.debug('activateOrOpen:', url, open)
    // Note: To Get Tab from Tabs (requires host permissions or tabs)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    console.debug('tabs:', tabs)
    for (const tab of tabs) {
        if (tab.url === url) {
            console.debug('%cTab found, activating:', 'color: Lime', tab)
            return await chrome.tabs.update(tab.id, { active: true })
        }
    }
    if (open) {
        console.debug('%cTab not found, opening url:', 'color: Yellow', url)
        return await chrome.tabs.create({ active: true, url })
    }
    console.warn('tab not found and open not set!')
}

/**
 * Update DOM with Manifest Details
 * @function updateManifest
 */
export async function updateManifest() {
    const manifest = chrome.runtime.getManifest()
    console.debug('updateManifest:', manifest)
    document.querySelectorAll('.version').forEach((el) => {
        el.textContent = manifest.version
    })
    document.querySelectorAll('[href="homepage_url"]').forEach((el) => {
        el.href = manifest.homepage_url
    })
    document.querySelectorAll('[href="version_url"]').forEach((el) => {
        el.href = `${githubURL}/releases/tag/${manifest.version}`
    })
}

/**
 * @function updateBrowser
 * @return {Promise<void>}
 */
export async function updateBrowser() {
    const selector = isFirefox ? '.firefox' : '.chrome'
    console.debug('updateBrowser:', selector)
    document.querySelectorAll(selector).forEach((el) => el.classList.remove('d-none'))
}

/**
 * @function updatePlatform
 * @return {Promise<chrome.runtime.PlatformInfo>}
 */
export async function updatePlatform() {
    const platform = await chrome.runtime.getPlatformInfo()
    console.debug('updatePlatform:', platform)
    const splitCls = (cls) => cls.split(' ').filter(Boolean)
    if (platform.os === 'android' && typeof document !== 'undefined') {
        // document.querySelectorAll('[class*="mobile-"]').forEach((el) => {
        document
            .querySelectorAll(
                '[data-mobile-add],[data-mobile-remove],[data-mobile-replace]',
            )
            .forEach((el) => {
                if (el.dataset.mobileAdd) {
                    for (const cls of splitCls(el.dataset.mobileAdd)) {
                        // console.debug('mobileAdd:', cls)
                        el.classList.add(cls)
                    }
                }
                if (el.dataset.mobileRemove) {
                    for (const cls of splitCls(el.dataset.mobileRemove)) {
                        // console.debug('mobileAdd:', cls)
                        el.classList.remove(cls)
                    }
                }
                if (el.dataset.mobileReplace) {
                    const split = splitCls(el.dataset.mobileReplace)
                    // console.debug('mobileReplace:', split)
                    for (let i = 0; i < split.length; i += 2) {
                        const one = split[i]
                        const two = split[i + 1]
                        // console.debug(`replace: ${one} >> ${two}`)
                        el.classList.replace(one, two)
                    }
                }
            })
    }
    return platform
}

/**
 * Check Host Permissions
 * @function checkPerms
 * @return {Promise<Boolean>}
 */
export async function checkPerms() {
    const hasPerms = await chrome.permissions.contains({
        origins: ['*://*/*'],
    })
    console.debug('checkPerms:', hasPerms)

    // Firefox still uses DOM Based Background Scripts
    if (typeof document === 'undefined') return hasPerms

    const hasPermsEl = document.querySelectorAll('.has-perms')
    const grantPermsEl = document.querySelectorAll('.grant-perms')
    if (hasPerms) {
        hasPermsEl.forEach((el) => el.classList.remove('d-none'))
        grantPermsEl.forEach((el) => el.classList.add('d-none'))
    } else {
        grantPermsEl.forEach((el) => el.classList.remove('d-none'))
        hasPermsEl.forEach((el) => el.classList.add('d-none'))
    }
    return hasPerms
}

/**
 * Grant Permissions Click Callback
 * @function grantPerms
 * @param {Event} event
 * @param {Boolean} [close]
 */
export async function grantPerms(event, close = false) {
    console.debug('grantPerms:', event)
    // noinspection ES6MissingAwait
    requestPerms()
    if (close) window.close()
}

/**
 * Request Host Permissions
 * @function requestPerms
 * @return {Promise<Boolean>}
 */
export async function requestPerms() {
    return await chrome.permissions.request({
        origins: ['*://*/*'],
    })
}

/**
 * Revoke Permissions Click Callback
 * Note: This method does not work on Chrome if permissions are required.
 * @function revokePerms
 * @param {MouseEvent} event
 */
export async function revokePerms(event) {
    console.debug('revokePerms:', event)
    const permissions = await chrome.permissions.getAll()
    console.debug('permissions:', permissions)
    try {
        await chrome.permissions.remove({
            origins: permissions.origins,
        })
        await checkPerms()
    } catch (e) {
        console.log(e)
        showToast(e.toString(), 'danger')
    }
}

/**
 * Permissions On Added Callback
 * @param {chrome.permissions} permissions
 */
export async function onAdded(permissions) {
    console.debug('onAdded', permissions)
    await checkPerms()
}

/**
 * Permissions On Removed Callback
 * @param {chrome.permissions} permissions
 */
export async function onRemoved(permissions) {
    console.debug('onRemoved', permissions)
    await checkPerms()
}

/**
 * Open Popup Click Callback
 * NOTE: Requires Chrome>=127
 * @function openPopup
 * @param {Event} [event]
 */
export async function openPopup(event) {
    console.debug('openPopup:', event)
    event?.preventDefault()
    // Note: This fails if popup is already open (ex. double clicks)
    try {
        await chrome.action.openPopup()
    } catch (e) {
        console.debug(e)
    }
}

/**
 * Open Extension Panel
 * @function openExtPanel
 * @param {String} [url]
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {String} [type]
 * @return {Promise<chrome.windows.Window|undefined>}
 */
export async function showPanel(
    url = '/html/panel.html',
    width = 720,
    height = 480,
    type = 'panel',
) {
    console.debug(`openExtPanel: ${url}`, width, height)
    if (!chrome.windows) {
        console.log('Browser does not support: chrome.windows')
        showToast('Browser does not support windows', 'danger')
        return
    }
    const { lastPanelID } = await chrome.storage.local.get(['lastPanelID'])
    console.debug('lastPanelID:', lastPanelID)

    try {
        const window = await chrome.windows.get(lastPanelID)
        if (window) {
            console.debug(`%c Window found: ${window.id}`, 'color: Lime')
            return await chrome.windows.update(lastPanelID, {
                focused: true,
            })
        }
    } catch (e) {
        console.log(e)
    }

    // noinspection JSCheckFunctionSignatures
    const window = await chrome.windows.create({ type, url, width, height })
    // NOTE: Code after windows.create is not executed on the first pop-out...
    console.debug(`%c Created new window: ${window.id}`, 'color: Yellow')
    // noinspection ES6MissingAwait
    // chrome.storage.local.set({ lastPanelID: window.id })
    return window
}

/**
 * Show Bootstrap Toast
 * @function showToast
 * @param {String} message
 * @param {String} type
 */
export function showToast(message, type = 'primary') {
    console.debug(`showToast: ${type}: ${message}`)
    const clone = document.querySelector('#clones > .toast')
    const container = document.getElementById('toast-container')
    if (!clone || !container) {
        return console.warn('Missing clone or container:', clone, container)
    }
    const element = clone.cloneNode(true)
    element.querySelector('.toast-body').textContent = message
    element.classList.add(`text-bg-${type}`)
    container.appendChild(element)
    const toast = new bootstrap.Toast(element)
    element.addEventListener('mousemove', () => toast.hide())
    toast.show()
}
