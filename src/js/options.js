// JS for options.html

import {
    Hosts,
    checkPerms,
    copyInput,
    grantPerms,
    showHidePassword,
    linkClick,
    onAdded,
    onRemoved,
    revokePerms,
    saveOptions,
    showToast,
    textFileDownload,
    updateManifest,
    updateOptions,
} from './export.js'

chrome.storage.onChanged.addListener(onChanged)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', initOptions)
// document.getElementById('add-host').addEventListener('submit', addHost)
document.getElementById('copy-support').addEventListener('click', copySupport)
const editForm = document.getElementById('edit-form')
editForm.addEventListener('submit', editSubmit)
editForm.addEventListener('change', editChange)

const hostsInput = document.getElementById('hosts-input')
hostsInput.addEventListener('change', hostsInputChange)
document.getElementById('import-hosts').addEventListener('click', importHosts)
document.getElementById('export-hosts').addEventListener('click', exportHosts)

document
    .querySelectorAll('.revoke-permissions')
    .forEach((el) => el.addEventListener('click', revokePerms))
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', grantPerms))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('[data-show-hide]')
    .forEach((el) => el.addEventListener('click', showHidePassword))
document
    .querySelectorAll('[data-copy-input]')
    .forEach((el) => el.addEventListener('click', copyInput))
document
    .querySelectorAll('#options-form input')
    .forEach((el) => el.addEventListener('change', saveOptions))
document
    .getElementById('options-form')
    .addEventListener('submit', (e) => e.preventDefault())
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))
document
    .getElementsByName('radioBackground')
    .forEach((el) => el.addEventListener('change', backgroundChange))

const bgPictureInput = document.getElementById('bgPictureInput')
const bgVideoInput = document.getElementById('bgVideoInput')

const editHostname = document.getElementById('hostname')
const editUsername = document.getElementById('username')
const editPassword = document.getElementById('password')

const confirmDelete = document.getElementById('confirm-delete')
const confirmDeleteHost = document.getElementById('delete-host')
const deleteModal = new bootstrap.Modal('#delete-modal')
confirmDelete.addEventListener('click', deleteHost)

const editModalEl = document.getElementById('edit-modal')
const editModalAlert = document.getElementById('edit-modal-alert')
const editModal = new bootstrap.Modal(editModalEl)
editModalEl.addEventListener('shown.bs.modal', () => {
    editUsername.focus()
})
editModalEl.addEventListener('hide.bs.modal', () => {
    editModal._config.backdrop = true
    editModalAlert.classList.add('d-none')
})
editModalEl.addEventListener('hidePrevented.bs.modal', () => {
    console.log('Changes Detected!')
    editModalAlert.classList.remove('d-none')
})

/**
 * Initialize Options
 * @function initOptions
 */
async function initOptions() {
    console.debug('initOptions')

    updateManifest()
    await setShortcuts()
    await checkPerms()

    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    // console.debug('options, sites:', options, sites)
    const { options } = await chrome.storage.sync.get(['options'])
    updateOptions(options)
    backgroundChange(options.radioBackground)
    const hosts = await Hosts.all()
    // console.debug('hosts:', hosts)
    updateTable(hosts)
}

// /**
//  * Add Host Callback
//  * @function addHost
//  * @param {SubmitEvent} event
//  */
// async function addHost(event) {
//     console.debug('addHost:', event)
//     event.preventDefault()
//     showToast('Not Yet Implemented', 'warning')
//     // const input = event.target.elements['host-name']
//     // let value = input.value
//     // console.debug('value:', value)
//     // if (!value.includes('://')) {
//     //     value = `https://${value}`
//     // }
//     // let url
//     // try {
//     //     url = new URL(value)
//     // } catch (e) {
//     //     showToast(e.message, 'danger')
//     //     input.focus()
//     //     input.select()
//     //     return console.info(e)
//     // }
//     // console.log('url:', url)
//     // const { sites } = await chrome.storage.sync.get(['sites'])
//     // if (url.hostname in sites) {
//     //     showToast(`Host Exists: ${url.hostname}`, 'warning')
//     //     input.focus()
//     //     input.select()
//     //     return console.info('Existing Host: url:', url)
//     // } else {
//     //     sites[url.hostname] = 'user:pass'
//     //     await chrome.storage.sync.set({ sites })
//     //     showToast(`Added Host: ${url.hostname}`)
//     //     console.log(`Added Host: ${url.hostname}`, url)
//     //     input.value = ''
//     //     input.focus()
//     // }
// }

/**
 * Update Popup Table with Data
 * @function updateTable
 * @param {Object} data
 */
function updateTable(data) {
    const hostsBody = document.querySelector('#hosts-table > tbody')
    hostsBody.innerHTML = ''
    const ignoredBody = document.querySelector('#ignored-table > tbody')
    ignoredBody.innerHTML = ''

    for (const [key, value] of Object.entries(data)) {
        const ignored = value === 'ignored'
        const row = ignored ? ignoredBody.insertRow() : hostsBody.insertRow()
        const username = value.split(':')[0]
        // console.debug('username:', username)

        const deleteBtn = document.createElement('a')
        const trash = document
            .querySelector('.d-none > .fa-regular.fa-trash-can')
            .cloneNode(true)
        deleteBtn.appendChild(trash)
        deleteBtn.title = 'Delete'
        deleteBtn.dataset.value = key
        deleteBtn.classList.add('link-danger')
        deleteBtn.setAttribute('role', 'button')
        deleteBtn.addEventListener('click', deleteHost)
        const cell1 = row.insertCell()
        cell1.classList.add('text-center')
        cell1.appendChild(deleteBtn)

        const hostLink = document.createElement('a')
        hostLink.text = key
        hostLink.title = key
        hostLink.href = `https://${key}`
        hostLink.target = '_blank'
        hostLink.setAttribute('role', 'button')
        const cell2 = row.insertCell()
        cell2.classList.add('text-break')
        cell2.appendChild(hostLink)

        if (ignored) {
            continue
        }

        const user = document.createTextNode(username)
        const cell3 = row.insertCell()
        cell3.appendChild(user)
        cell3.classList.add('d-none', 'd-sm-table-cell')

        const editBtn = document.createElement('a')
        const edit = document
            .querySelector('.d-none > .fa-pen-to-square')
            .cloneNode(true)
        editBtn.appendChild(edit)
        editBtn.title = 'Edit'
        editBtn.dataset.value = key
        editBtn.classList.add('link-warning')
        editBtn.setAttribute('role', 'button')
        editBtn.addEventListener('click', editClick)
        const cell4 = row.insertCell()
        cell4.classList.add('text-center')
        cell4.appendChild(editBtn)
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
        confirmDelete.dataset.value = host
        confirmDeleteHost.textContent = host
        deleteModal.show()
        return
    }
    await Hosts.delete(host)
    deleteModal.hide()
    showToast(`Removed: ${host}`)
}

/**
 * Edit Host Click Callback
 * @function editClick
 * @param {MouseEvent} event
 */
async function editClick(event) {
    console.debug('editClick:', event)
    const host = event.currentTarget?.dataset?.value
    console.debug('host:', host)
    // showToast('Not Yet Implemented', 'warning')
    // const { sites } = await chrome.storage.sync.get(['sites'])
    const creds = await Hosts.get(host)
    const [username, password] = creds.split(':')
    editHostname.value = host
    editHostname.dataset.original = host
    editUsername.value = username
    editUsername.dataset.original = username
    editPassword.value = password
    editPassword.dataset.original = password
    editPassword.type = 'password'
    editModal.show()
}

/**
 * Edit Host Submit Callback
 * @function editSubmit
 * @param {SubmitEvent} event
 */
async function editSubmit(event) {
    console.debug('editSubmit:', event)
    event.preventDefault()
    event.stopPropagation()
    const hostname = editHostname.value.toLowerCase()
    const username = editUsername.value
    const password = editPassword.value
    // console.debug('hostname ,username, password:', hostname, username, password)
    if (
        hostname === editHostname.dataset.original &&
        username === editUsername.dataset.original &&
        password === editPassword.dataset.original
    ) {
        editModal.hide()
        return showToast('No Changes Detected', 'warning')
    }
    // const { sites } = await chrome.storage.sync.get(['sites'])
    // if (hostname !== editHostname.dataset.original) {
    //     delete sites[editHostname.dataset.original]
    // }
    // sites[hostname] = `${username}:${password}`
    // await chrome.storage.sync.set({ sites })
    await Hosts.edit(
        editHostname.dataset.original,
        hostname,
        `${username}:${password}`
    )
    editModal.hide()
    showToast(`Updated Host: ${hostname}`, 'success')
}

/**
 * Edit Host Change Callback
 * @function editChange
 * @param {SubmitEvent} event
 */
async function editChange(event) {
    console.debug('editChange:', event)
    editModal._config.backdrop = 'static'
}

/**
 * Import Hosts Click Callback
 * @function importHosts
 * @param {MouseEvent} event
 */
async function importHosts(event) {
    console.debug('importHosts:', event)
    event.preventDefault()
    hostsInput.click()
}

/**
 * Export Hosts Click Callback
 * @function exportHosts
 * @param {MouseEvent} event
 */
async function exportHosts(event) {
    console.debug('exportHosts:', event)
    event.preventDefault()
    // const { sites } = await chrome.storage.sync.get(['sites'])
    // console.debug('sites:', sites)

    const hosts = await Hosts.all()
    // console.debug('hosts:', hosts)
    if (Object.keys(hosts).length === 0) {
        return showToast('No Credentials to Export', 'warning')
    }
    const json = JSON.stringify(hosts, null, 2)
    textFileDownload('auto-auth-secrets.txt', json)
}

/**
 * Hosts Input Change Callback
 * @function hostsInputChange
 * @param {InputEvent} event
 */
async function hostsInputChange(event) {
    console.debug('hostsInputChange:', event, hostsInput)
    event.preventDefault()
    const fileReader = new FileReader()
    fileReader.onload = async function doBannedImport() {
        const results = JSON.parse(fileReader.result.toString())
        // console.debug('results:', results)
        // const { sites } = await chrome.storage.sync.get(['sites'])
        const hosts = {}
        let count = 0
        for (const [key, value] of Object.entries(results)) {
            count += 1
            if (typeof value === 'object') {
                const { username, password } = value
                hosts[key] = `${username}:${password}`
            } else if (typeof value === 'string') {
                // const [username, password] = value.split(':')
                hosts[key] = value
            }
        }
        // console.debug('hosts:', hosts)
        // await chrome.storage.sync.set({ sites })
        await Hosts.update(hosts)
        showToast(`Imported/Updated ${count} Hosts.`, 'success')
    }
    fileReader.readAsText(hostsInput.files[0])
}

/**
 * Auth Background Change Callback
 * @function backgroundChange
 * @param {String|InputEvent} event
 */
function backgroundChange(event) {
    console.debug('backgroundChange:', event)
    const id = typeof event === 'string' ? event : event?.target?.id
    console.debug('id:', id)
    if (id === 'bgPicture') {
        bgPictureInput.classList.remove('d-none')
        bgVideoInput.classList.add('d-none')
    } else if (id === 'bgVideo') {
        bgPictureInput.classList.add('d-none')
        bgVideoInput.classList.remove('d-none')
    } else {
        bgPictureInput.classList.add('d-none')
        bgVideoInput.classList.add('d-none')
    }
}

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
async function onChanged(changes, namespace) {
    // console.debug('onChanged:', changes, namespace)
    if (namespace === 'sync') {
        if ('options' in changes) {
            updateOptions(changes.newValue)
        } else {
            const hosts = await Hosts.all()
            // console.debug('hosts:', hosts)
            updateTable(hosts)
        }
    }
    // for (const [key, { newValue }] of Object.entries(changes)) {
    //     if (namespace === 'sync') {
    //         if (key === 'options') {
    //             updateOptions(newValue)
    //         } else {
    //             const hosts = await Hosts.all()
    //             console.debug('hosts:', hosts)
    //             updateTable(hosts)
    //         }
    //     }
    // }
}

/**
 * Set Keyboard Shortcuts
 * @function setShortcuts
 * @param {String} selector
 */
async function setShortcuts(selector = '#keyboard-shortcuts') {
    if (!chrome.commands) {
        return console.debug('Skipping: chrome.commands')
    }
    const table = document.querySelector(selector)
    const tbody = table.querySelector('tbody')
    const source = table.querySelector('tfoot > tr').cloneNode(true)
    const commands = await chrome.commands.getAll()
    for (const command of commands) {
        // console.debug('command:', command)
        const row = source.cloneNode(true)
        // TODO: Chrome does not parse the description for _execute_action in manifest.json
        let description = command.description
        if (!description && command.name === '_execute_action') {
            description = 'Show Popup'
        }
        row.querySelector('.description').textContent = description
        row.querySelector('kbd').textContent = command.shortcut || 'Not Set'
        tbody.appendChild(row)
    }
}

/**
 * Copy Support/Debugging Information
 * @function copySupport
 * @param {MouseEvent} event
 */
async function copySupport(event) {
    console.debug('copySupport:', event)
    event.preventDefault()
    const manifest = chrome.runtime.getManifest()
    const { options } = await chrome.storage.sync.get(['options'])
    const permissions = await chrome.permissions.getAll()
    const result = [
        `${manifest.name} - ${manifest.version}`,
        navigator.userAgent,
        `permissions.origins: ${JSON.stringify(permissions.origins)}`,
        `options: ${JSON.stringify(options)}`,
    ]
    await navigator.clipboard.writeText(result.join('\n'))
    showToast('Support Information Copied.', 'success')
}
