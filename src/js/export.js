// JS Exports

export const githubURL = 'https://github.com/cssnr/auto-auth'

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
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)
    element.classList.add('d-none')
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
 * Show Extension Panel
 * @function showPanel
 * @param {Number} height
 * @param {Number} width
 */
export async function showPanel(height = 520, width = 480) {
    return await chrome.windows.create({
        type: 'panel',
        url: '/html/panel.html',
        width,
        height,
    })
}

/**
 * @function copyInput
 * @param {MouseEvent} event
 * @return {Promise<void>}
 */
export async function copyInput(event) {
    console.debug('copyInput:', event)
    const el = event.currentTarget || event.target.closest('button')
    console.debug('el.dataset.copyInput:', el.dataset.copyInput)
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
        value = event.target.value.toString()
    } else {
        value = event.target.value
    }
    if (value !== undefined) {
        options[key] = value
        console.log(`%cSet: ${key}:`, 'color: Lime', value)
        await chrome.storage.sync.set({ options })
    } else {
        console.warn('No Value for key:', key)
    }
}

/**
 * Update Options based on type
 * @function initOptions
 * @param {Object} options
 */
export function updateOptions(options) {
    console.debug('updateOptions:', options)
    for (let [key, value] of Object.entries(options)) {
        if (typeof value === 'undefined') {
            console.warn('Value undefined for key:', key)
            continue
        }
        // Option Key should be `radioXXX` and values should be the option IDs
        if (key.startsWith('radio')) {
            key = value
            value = true
        }
        // console.debug(`${key}: ${value}`)
        const el = document.getElementById(key)
        if (!el) {
            continue
        }
        if (el.tagName !== 'INPUT') {
            el.textContent = value.toString()
        } else if (['checkbox', 'radio'].includes(el.type)) {
            el.checked = value
        } else {
            el.value = value
        }
        if (el.dataset.related) {
            hideShowElement(`#${el.dataset.related}`, value)
        }
        if (el.dataset.warning) {
            addWarningClass(el.nextElementSibling, value, el.dataset.warning)
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
 * Add Warning Class to Element
 * @function addWarningClass
 * @param {HTMLElement} element
 * @param {Boolean} value
 * @param {String} warning
 */
function addWarningClass(element, value, warning) {
    // console.debug('addWarningClass:', value, element)
    if (value) {
        element.classList.add(warning)
    } else {
        element.classList.remove(warning)
    }
}

/**
 * Link Click Callback
 * Firefox requires a call to window.close()
 * @function linkClick
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function linkClick(event, close = false) {
    // console.debug('linkClick:', event, close)
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href').replace(/^\.+/g, '')
    // console.debug('href:', href)
    if (href.startsWith('#')) {
        // console.debug('return on anchor link')
        return
    }
    let url
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
    console.debug('activateOrOpen:', url)
    // Get Tab from Tabs (requires host permissions)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    // console.debug('tabs:', tabs)
    for (const tab of tabs) {
        if (tab.url === url) {
            console.debug('found tab in tabs:', tab)
            return await chrome.tabs.update(tab.id, { active: true })
        }
    }
    console.debug('tab not found, open:', open)
    if (open) {
        return await chrome.tabs.create({ active: true, url })
    }
}

/**
 * Update DOM with Manifest Details
 * @function updateManifest
 */
export async function updateManifest() {
    try {
        const manifest = chrome.runtime.getManifest()
        document.querySelectorAll('.version').forEach((el) => {
            el.textContent = manifest.version
        })
        document.querySelectorAll('[href="version_url"]').forEach((el) => {
            el.href = `${githubURL}/releases/tag/${manifest.version}`
        })
        document.querySelectorAll('[href="homepage_url"]').forEach((el) => {
            el.href = manifest.homepage_url
        })
    } catch (e) {
        console.log('Error updating manifest settings:', e)
    }
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
    if (typeof document === 'undefined') {
        return hasPerms
    }
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
 * @param {MouseEvent} event
 * @param {Boolean} [close]
 */
export async function grantPerms(event, close = false) {
    console.debug('grantPerms:', event)
    // noinspection ES6MissingAwait
    requestPerms()
    if (close) {
        window.close()
    }
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
 * NOTE: For many reasons Chrome will determine host_perms are required and
 *       will ask for them at install time and not allow them to be revoked
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
        console.log(`%cError: ${e.message}`, 'color: Red', e)
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
 * Show Bootstrap Toast
 * @function showToast
 * @param {String} message
 * @param {String} type
 */
export function showToast(message, type = 'primary') {
    console.debug(`showToast: ${type}: ${message}`)
    const clone = document.querySelector('.d-none > .toast')
    const container = document.getElementById('toast-container')
    if (!clone || !container) {
        return console.warn('Missing clone or container:', clone, container)
    }
    const element = clone.cloneNode(true)
    element.querySelector('.toast-body').innerHTML = message
    element.classList.add(`text-bg-${type}`)
    container.appendChild(element)
    const toast = new bootstrap.Toast(element)
    element.addEventListener('mousemove', () => toast.hide())
    toast.show()
}
