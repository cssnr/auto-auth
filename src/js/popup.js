// JS for popup.html

import {
    checkPerms,
    deleteCredentials,
    grantPerms,
    linkClick,
    saveOptions,
    showToast,
    updateManifest,
    updateOptions,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)

document.addEventListener('DOMContentLoaded', initPopup)
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', (e) => grantPerms(e, true)))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', (e) => linkClick(e, true)))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

const hostDiv = document.getElementById('host')
const deleteSaved = document.getElementById('delete-saved')

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    updateManifest()

    const { options, sites } = await chrome.storage.sync.get([
        'options',
        'sites',
    ])
    // console.debug('options, sites:', options, sites)
    updateOptions(options)

    if (chrome.runtime.lastError) {
        showToast(chrome.runtime.lastError.message, 'warning')
    }

    // Check Host Permissions
    const hasPerms = await checkPerms()
    if (!hasPerms) {
        console.log('%cMissing Host Permissions', 'color: Red')
    }

    // Check Tab Permissions
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    console.debug('tab:', tab)
    if (tab.url) {
        const url = new URL(tab.url)
        if (url.host in sites) {
            hostDiv.classList.add('border-success')
            hostDiv.textContent = url.host
            deleteSaved.classList.remove('d-none')
            deleteSaved.dataset.value = url.host
            deleteSaved.addEventListener('click', removeCredentials)
        } else {
            hostDiv.textContent = 'No Credentials Found for Tab.'
            hostDiv.classList.remove('border-success')
            deleteSaved.classList.add('d-none')
        }
    } else {
        hostDiv.classList.add('border-danger-subtle')
    }
}

async function removeCredentials(event) {
    console.debug('removeCredentials:', event)
    const host = event.currentTarget?.dataset?.value
    await deleteCredentials(host) // TODO: check return value
    await initPopup()
    showToast(`Removed: ${host}`)
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
function onChanged(changes, namespace) {
    // console.debug('onChanged:', changes, namespace)
    for (let [key, { newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options') {
            updateOptions(newValue)
        }
    }
}
