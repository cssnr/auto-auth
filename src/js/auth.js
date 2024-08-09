// JS for auth.html

import { showHidePassword, showToast } from './export.js'

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('ignore-host').addEventListener('click', ignoreHost)
document.getElementById('auth-form').addEventListener('submit', submitAuth)
document
    .querySelectorAll('[data-paste-input]')
    .forEach((el) => el.addEventListener('click', pasteInput))
document
    .querySelectorAll('[data-show-hide]')
    .forEach((el) => el.addEventListener('click', showHidePassword))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

const save = document.getElementById('save')
save.addEventListener('change', saveChange)

const searchParams = new URLSearchParams(window.location.search)
const url = new URL(searchParams.get('url'))

document.querySelectorAll('.host').forEach((el) => (el.textContent = url.host))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded:', searchParams, url)

    if (searchParams.get('fail')) {
        document.getElementById('fail').classList.remove('d-none')
    }

    const link = document.getElementById('link')
    link.textContent = url.href
    link.href = url.href
    document.getElementById('hostname').value = url.host

    const { options, sites } = await chrome.storage.sync.get([
        'options',
        'sites',
    ])
    // console.debug('options, sites:', options, sites)
    setBackground(options)
    save.checked = options.defaultSave
    if (url.host in sites) {
        if (sites[url.host] !== 'ignored') {
            const [username, password] = sites[url.host].split(':')
            const user = document.getElementById('username')
            user.value = username
            user.select()
            document.getElementById('password').value = password
        }
    }
}

async function ignoreHost(event) {
    console.debug('ignoreHost:', event)
    const { sites } = await chrome.storage.sync.get(['sites'])
    console.debug('sites:', sites)
    sites[url.host] = 'ignored'
    await chrome.storage.sync.set({ sites })

    document.body.remove()
    // window.location = url.href
    // location.href = url.href
    const tab = await chrome.tabs.getCurrent()
    console.debug('tab.id:', tab.id)
    await chrome.tabs.update(tab.id, {
        url: url.href,
    })
}

async function submitAuth(event) {
    console.debug('submitAuth:', event)
    event.preventDefault()
    event.submitter.classList.add('disabled')
    document.getElementById('icon').className = 'fa-solid fa-sync fa-spin ms-2'

    const host = event.target.elements.hostname.value
    const user = event.target.elements.username.value
    const pass = event.target.elements.password.value
    console.debug('host, user, pass:', host, user, pass)

    const { sites } = await chrome.storage.sync.get(['sites'])
    console.debug('sites:', sites)
    sites[host] = `${user}:${pass}`
    // TODO: Update to async/await
    await chrome.storage.sync.set({ sites }).then(() => {
        console.log(
            '%cCredentials Saved.',
            'color: LimeGreen',
            `Loading: ${url.href}`
        )
        chrome.tabs.getCurrent().then((tab) => {
            console.debug('tab.id:', tab.id)
            chrome.tabs.update(tab.id, {
                url: url.href,
            })
        })
    })
}

/**
 * TODO: Add Optional Permissions for clipboardRead
 * @function pasteInput
 * @param {MouseEvent} event
 * @return {Promise<void>}
 */
async function pasteInput(event) {
    console.debug('pasteInput:', event)
    showToast('Feature Not Yet Implemented', 'warning')
    // const text = await navigator.clipboard.readText()
    // console.debug('text:', text)
    // console.debug('pasteInput:', event.currentTarget.dataset.pasteInput)
    // const input = document.querySelector(event.currentTarget.dataset.pasteInput)
    // console.debug('input:', input)
    // input.value = text
}

function saveChange(event) {
    console.debug('saveChange:', event)
    showToast('Not Yet Implemented, All Logins are Saved', 'warning')
}

/**
 * Set Background
 * @function setBackground
 * @param {Object} options
 */
function setBackground(options) {
    console.debug('setBackground:', options)
    const video = document.querySelector('video')
    if (options.radioBackground === 'bgPicture') {
        const url = options.pictureURL || 'https://picsum.photos/1920/1080'
        document.body.style.background = `url('${url}') no-repeat center fixed`
        document.body.style.backgroundSize = 'cover'
        video.classList.add('d-none')
    } else if (options.radioBackground === 'bgVideo') {
        const src = options.videoURL || '/media/loop.mp4'
        video.classList.remove('d-none')
        video.src = src
        document.body.style.cssText = ''
    } else {
        document.body.style.cssText = ''
        video.classList.add('d-none')
    }
}
