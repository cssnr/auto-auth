// JS Exports

// /**
//  * Save Credentials Function
//  * @function saveCredentials
//  * @param {String} host
//  * @param {String} user
//  * @param {String} pass
//  */
// export async function saveCredentials(host, user, pass) {
//     console.debug('saveCredentials:', host, user, pass)
//     const { sites } = await chrome.storage.sync.get(['sites'])
//     console.debug('sites:', sites)
//     sites[host] = `${user}:${pass}`
//     await chrome.storage.sync.set({ sites })
// }

/**
 * Delete Host
 * @function deleteHost
 * @param {String} host
 */
export async function deleteCredentials(host) {
    console.debug('deleteCredentials:', host)
    // console.debug('deleteCredentials:', event)
    // event.preventDefault()
    // const host = event.currentTarget?.dataset?.value
    console.log(`%cDelete Host: ${host}`, 'color: Yellow')
    const { sites } = await chrome.storage.sync.get(['sites'])
    // console.debug('sites:', sites)
    if (host && host in sites) {
        delete sites[host]
        await chrome.storage.sync.set({ sites })
        // showToast(`Removed: ${host}`, 'primary')
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
    console.debug('hideShowElement:', show, element)
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
    console.debug('addWarningClass:', value, element)
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
    console.debug('linkClick:', event, close)
    event.preventDefault()
    const href = event.currentTarget.getAttribute('href').replace(/^\.+/g, '')
    console.debug('href:', href)
    if (href.startsWith('#')) {
        return console.debug('return on anchor link')
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
 * @return {Promise<*|Boolean>}
 */
export async function activateOrOpen(url, open = true) {
    console.debug('activateOrOpen:', url)
    // Get Tab from Tabs (requires host permissions)
    const tabs = await chrome.tabs.query({ currentWindow: true })
    console.debug('tabs:', tabs)
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
export function updateManifest() {
    const manifest = chrome.runtime.getManifest()
    document
        .querySelectorAll('.version')
        .forEach((el) => (el.textContent = manifest.version))
    document
        .querySelectorAll('[href="homepage_url"]')
        .forEach((el) => (el.href = manifest.homepage_url))
}

/**
 * Check Host Permissions
 * @function checkPerms
 * @return {Promise<*|Boolean>}
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
    requestPerms() // Firefox: Do NOT await so that we can call window.close()
    if (close) {
        window.close()
    }
}

/**
 * Request Host Permissions
 * @function requestPerms
 * @return {Promise<*|chrome.permissions.request>}
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
export function showToast(message, type = 'success') {
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

// /**
//  * Inject Function into Current Tab with args
//  * @function injectFunction
//  * @param {Function} func
//  * @param {Array} args
//  * @return {Promise<*|InjectionResult>}
//  */
// export async function injectFunction(func, args) {
//     const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
//     return await chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: func,
//         args: args,
//     })
// }
