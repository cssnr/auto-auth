// JS for options.html

import {
    checkPerms,
    deleteCredentials,
    grantPerms,
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
document.getElementById('add-host').addEventListener('submit', addHost)
document.getElementById('copy-support').addEventListener('click', copySupport)

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

/**
 * Initialize Options
 * @function initOptions
 */
async function initOptions() {
    console.debug('initOptions')

    updateManifest()
    await setShortcuts()
    await checkPerms()

    const { options, sites } = await chrome.storage.sync.get([
        'options',
        'sites',
    ])
    console.debug('options, sites:', options, sites)
    updateOptions(options)
    backgroundChange(options.radioBackground)
    updateTable(sites)
}

/**
 * Add Host Callback
 * @function addHost
 * @param {SubmitEvent} event
 */
async function addHost(event) {
    console.debug('addHost:', event)
    event.preventDefault()
    showToast('Not Yet Implemented', 'warning')
    // const input = event.target.elements['host-name']
    // let value = input.value
    // console.debug('value:', value)
    // if (!value.includes('://')) {
    //     value = `https://${value}`
    // }
    // let url
    // try {
    //     url = new URL(value)
    // } catch (e) {
    //     showToast(e.message, 'danger')
    //     input.focus()
    //     input.select()
    //     return console.info(e)
    // }
    // console.log('url:', url)
    // const { sites } = await chrome.storage.sync.get(['sites'])
    // if (url.hostname in sites) {
    //     showToast(`Host Exists: ${url.hostname}`, 'warning')
    //     input.focus()
    //     input.select()
    //     return console.info('Existing Host: url:', url)
    // } else {
    //     sites[url.hostname] = 'user:pass'
    //     await chrome.storage.sync.set({ sites })
    //     showToast(`Added Host: ${url.hostname}`)
    //     console.log(`Added Host: ${url.hostname}`, url)
    //     input.value = ''
    //     input.focus()
    // }
}

/**
 * Update Popup Table with Data
 * @function updateTable
 * @param {Object} data
 */
function updateTable(data) {
    const tbody = document.querySelector('#hosts-table > tbody')
    tbody.innerHTML = ''

    for (const [key, value] of Object.entries(data)) {
        const row = tbody.insertRow()
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
        editBtn.addEventListener('click', editHost)
        const cell4 = row.insertCell()
        cell4.classList.add('text-center')
        cell4.appendChild(editBtn)
    }
}

/**
 * Delete Host
 * @function deleteHost
 * @param {MouseEvent} event
 */
async function deleteHost(event) {
    console.debug('deleteHost:', event)
    const host = event.currentTarget?.dataset?.value
    await deleteCredentials(host)
    showToast(`Removed: ${host}`, 'primary')
    // event.preventDefault()
    // const host = event.currentTarget?.dataset?.value
    // console.log(`%cDelete Host: ${host}`, 'color: Yellow')
    // const { sites } = await chrome.storage.sync.get(['sites'])
    // // console.debug('sites:', sites)
    // if (host && host in sites) {
    //     delete sites[host]
    //     await chrome.storage.sync.set({ sites })
    //     showToast(`Removed: ${host}`, 'primary')
    // }
}

/**
 * Delete Host
 * @function editHost
 * @param {MouseEvent} event
 */
async function editHost(event) {
    console.debug('deleteHost:', event)
    const host = event.currentTarget?.dataset?.value
    console.debug('host:', host)
    showToast('Not Yet Implemented', 'warning')
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
    const { sites } = await chrome.storage.sync.get(['sites'])
    console.debug('sites:', sites)
    if (Object.keys(sites).length === 0) {
        return showToast('No Credentials to Export', 'warning')
    }
    const json = JSON.stringify(sites, null, 2)
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
        console.debug('results:', results)
        const { sites } = await chrome.storage.sync.get(['sites'])
        let count = 0
        for (const [key, value] of Object.entries(results)) {
            count += 1
            if (typeof value === 'object') {
                const { username, password } = value
                sites[key] = `${username}:${password}`
            } else if (typeof value === 'string') {
                // const [username, password] = value.split(':')
                sites[key] = value
            }
        }
        console.debug('sites:', sites)
        await chrome.storage.sync.set({ sites })
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
function onChanged(changes, namespace) {
    console.debug('onChanged:', changes, namespace)
    for (const [key, { newValue }] of Object.entries(changes)) {
        if (namespace === 'sync') {
            if (key === 'options') {
                updateOptions(newValue)
            }
            if (namespace === 'sync' && key === 'sites') {
                updateTable(newValue)
            }
        }
    }
}

/**
 * Set Keyboard Shortcuts
 * @function setShortcuts
 * @param {String} selector
 */
async function setShortcuts(selector = '#keyboard-shortcuts') {
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
    showToast('Support Information Copied.')
}
