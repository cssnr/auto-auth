// JS for auth.html

import { Hosts, linkClick, showHidePassword, showToast } from './export.js'

const searchParams = new URLSearchParams(window.location.search)
const url = new URL(searchParams.get('url'))

document.querySelectorAll('.host').forEach((el) => (el.textContent = url.host))
document.title = `Login for ${url.host}`
document.getElementById('favicon').href = `${url.origin}/favicon.ico`

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('auth-form').addEventListener('submit', submitAuth)
document.getElementById('ignore-host').addEventListener('click', ignoreHost)
document
    .querySelectorAll('[data-paste-input]')
    .forEach((el) => el.addEventListener('click', pasteInput))
document
    .querySelectorAll('[data-show-hide]')
    .forEach((el) => el.addEventListener('click', showHidePassword))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))
document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el))

const userInput = document.getElementById('username')
const passInput = document.getElementById('password')

const saveCreds = document.getElementById('saveCreds')
saveCreds.addEventListener('change', saveChange)

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

    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    const { options } = await chrome.storage.sync.get(['options'])
    const { session } = await chrome.storage.session.get(['session'])
    // console.debug('options, sites:', options, sites)
    setBackground(options)

    const tempSave = sessionStorage.getItem(url.host)
    if (tempSave) {
        saveCreds.checked = !!parseInt(tempSave)
    } else {
        saveCreds.checked = options.defaultSave
    }
    if (!saveCreds.checked) {
        document.getElementById('save-session').classList.remove('d-none')
    }

    const creds = await Hosts.get(url.host)
    // console.log('creds:', creds)

    if (creds) {
        if (creds !== 'ignored') {
            const [username, password] = creds.split(':')
            const user = userInput
            user.value = username
            user.select()
            passInput.value = password
        }
    } else if (url.host in session) {
        const [username, password] = session[url.host].split(':')
        const user = userInput
        user.value = username
        user.select()
        passInput.value = password
    }
}

async function ignoreHost(event) {
    console.debug('ignoreHost:', event)
    // const { sites } = await chrome.storage.sync.get(['sites'])
    // // console.debug('sites:', sites)
    // sites[url.host] = 'ignored'
    // await chrome.storage.sync.set({ sites })
    await Hosts.set(url.host, 'ignored')

    document.body.remove()
    // window.location = url.href
    // location.href = url.href
    const tab = await chrome.tabs.getCurrent()
    // console.debug('tab:', tab)
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
    // console.debug('host, user, pass:', host, user, pass)

    if (event.target.elements.saveCreds.checked) {
        // const { sites } = await chrome.storage.sync.get(['sites'])
        // sites[host] = `${user}:${pass}`
        // await chrome.storage.sync.set({ sites })
        await Hosts.set(url.host, `${user}:${pass}`)
        console.log(
            '%cCredentials Saved.',
            `Loading: ${url.href}`,
            'color: LimeGreen'
        )
    } else {
        const { session } = await chrome.storage.session.get(['session'])
        session[host] = `${user}:${pass}`
        await chrome.storage.session.set({ session })
        console.log(
            '%cCredentials Saved for Session Only.',
            `Loading: ${url.href}`,
            'color: SpringGreen'
        )
    }
    const tab = await chrome.tabs.getCurrent()
    // console.debug('tab:', tab)
    await chrome.tabs.update(tab.id, {
        url: url.href,
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
    // console.debug('event.currentTarget.checked:', event.currentTarget.checked)
    if (event.currentTarget.checked) {
        document.getElementById('save-session').classList.add('d-none')
        sessionStorage.setItem(url.host, '1')
    } else {
        document.getElementById('save-session').classList.remove('d-none')
        sessionStorage.setItem(url.host, '0')
    }
}

/**
 * Set Background
 * @function setBackground
 * @param {Object} options
 */
function setBackground(options) {
    console.debug('setBackground:', options.radioBackground)
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
