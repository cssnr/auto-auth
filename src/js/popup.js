// JS for popup.html

import {
    Hosts,
    checkPerms,
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

const confirmDelete = document.getElementById('confirm-delete')
const confirmDeleteHost = document.getElementById('delete-host')
const deleteModal = new bootstrap.Modal('#delete-modal')
confirmDelete.addEventListener('click', deleteHost)

const hostnameEl = document.getElementById('hostname')
const deleteSaved = document.getElementById('delete-saved')
const usernameEl = document.getElementById('username')

/**
 * Initialize Popup
 * @function initPopup
 */
async function initPopup() {
    console.debug('initPopup')
    void updateManifest()
    checkPerms().then((hasPerms) => {
        if (!hasPerms) console.log('%cMissing Host Permissions', 'color: Red')
    })
    chrome.storage.sync
        .get(['options'])
        .then((items) => updateOptions(items.options))
    if (chrome.runtime.lastError) {
        showToast(chrome.runtime.lastError.message, 'warning')
    }

    // Check Tab Permissions
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true })
    console.debug('tab:', tab)
    if (tab.url) {
        const url = new URL(tab.url)
        const creds = await Hosts.get(url.host)
        if (creds) {
            if (creds === 'ignored') {
                hostnameEl.classList.add('border-warning')
                deleteSaved.querySelector('span').textContent =
                    'Remove Host from Ignore'
            } else {
                hostnameEl.classList.add('border-success')
                usernameEl.querySelector('span').textContent =
                    creds.split(':')[0]
                usernameEl.classList.remove('d-none')
            }
            hostnameEl.textContent = url.host
            deleteSaved.classList.remove('d-none')
            deleteSaved.dataset.value = url.host
            deleteSaved.addEventListener('click', deleteHost)
            confirmDelete.dataset.value = url.host
            confirmDeleteHost.textContent = url.host
        } else {
            hostnameEl.textContent = 'No Credentials Found for Tab.'
            hostnameEl.classList.remove('border-success', 'border-warning')
            deleteSaved.classList.add('d-none')
            usernameEl.classList.add('d-none')
        }
    } else {
        hostnameEl.classList.add('border-danger-subtle')
    }
}

/**
 * Delete Host
 * TODO: Cleanup This Function, Elements, and Event Listeners
 * @function deleteHost
 * @param {MouseEvent} event
 */
async function deleteHost(event) {
    console.debug('deleteHost:', event)
    const host = event.currentTarget?.dataset?.value
    console.debug('host:', host)
    const confirm = event.currentTarget?.id !== 'confirm-delete'
    const { options } = await chrome.storage.sync.get(['options'])
    if (options.confirmDelete && !!confirm) {
        console.debug('Show Delete Modal')
        // confirmDelete.dataset.value = host
        // confirmDeleteHost.textContent = host
        deleteModal.show()
        return
    }
    await Hosts.delete(host)
    deleteModal.hide()
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
