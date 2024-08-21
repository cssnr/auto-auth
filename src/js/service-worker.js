// JS Background Service Worker

import { Hosts, checkPerms, showPanel, githubURL } from './export.js'

chrome.runtime.onStartup.addListener(onStartup)
chrome.runtime.onInstalled.addListener(onInstalled)
chrome.contextMenus?.onClicked.addListener(onClicked)
chrome.commands?.onCommand.addListener(onCommand)
chrome.runtime.onMessage.addListener(onMessage)
chrome.storage.onChanged.addListener(onChanged)
chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

chrome.webRequest.onAuthRequired.addListener(
    onAuthRequired,
    { urls: ['<all_urls>'] },
    ['asyncBlocking']
)
chrome.webRequest.onCompleted.addListener(webRequestFinished, {
    urls: ['<all_urls>'],
})
chrome.webRequest.onErrorOccurred.addListener(webRequestFinished, {
    urls: ['<all_urls>'],
})

const pendingRequests = []

async function onAuthRequired(details, callback) {
    console.debug('onAuthRequired:', details)
    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    // console.debug('options, sites:', options, sites)
    let { options } = await chrome.storage.sync.get(['options'])
    if (options.tempDisabled) {
        console.log('%cExtension is Temporarily Disabled!', 'color: Red')
        return callback()
    }
    if (options.ignoreProxy && details.statusCode === 407) {
        console.log('%cIgnoring Proxy Authentication!', 'color: Yellow')
        return callback()
    }
    const url = new URL(details.url)
    // console.debug('url.host:', url.host)

    const hijackRequest = (failed = false) => {
        const color = failed ? 'Yellow' : 'Lime'
        console.log(
            `Cancel Request and Hijack w/ failed: %c${failed}`,
            `color: ${color}`
        )
        const auth = new URL(chrome.runtime.getURL('/html/auth.html'))
        auth.searchParams.append('url', details.url)
        if (failed) {
            auth.searchParams.append('fail', 'yes')
        }
        chrome.tabs.update(details.tabId, {
            url: auth.href,
        })
        callback({ cancel: true })
    }

    // Check if Request Already Processed
    if (pendingRequests.includes(details.requestId)) {
        console.log(
            `%cAlready Processed Request ID: ${details.requestId}`,
            'color: Orange'
        )
        hijackRequest(true)
    }
    pendingRequests.push(details.requestId)

    const creds = await Hosts.get(url.host)
    // console.log('creds:', creds)

    // Check for Saved Credentials
    if (creds) {
        if (creds === 'ignored') {
            console.log(
                `%cHost is Set to Ignored: %c${url.host}`,
                'color: Yellow',
                'color: Violet'
            )
            return callback()
        }
        console.log(
            `%cSending Saved Creds for: ${details.requestId}`,
            'color: LimeGreen'
        )
        const [username, password] = creds.split(':')
        const authCredentials = {
            username,
            password,
        }
        // console.debug('authCredentials:', authCredentials)
        return callback({ authCredentials })
    }

    // Check for Temporary Credentials
    const { session } = await chrome.storage.session.get(['session'])
    if (url.host in session) {
        console.log(
            `%cSending Session Creds for: ${details.requestId}`,
            'color: SpringGreen'
        )
        const [username, password] = session[url.host].split(':')
        const authCredentials = {
            username,
            password,
        }
        // console.debug('authCredentials:', authCredentials)
        return callback({ authCredentials })
    }

    // New Request Without Credentials
    console.log(
        `%cNo Credentials for Request ID: ${details.requestId}`,
        'color: DeepSkyBlue'
    )
    hijackRequest()
}

function webRequestFinished(requestDetails) {
    // console.debug(`webRequestFinished: ${requestDetails.requestId}`)
    let index = pendingRequests.indexOf(requestDetails.requestId)
    if (index > -1) {
        console.debug(
            `%cRemoving pendingRequests: ${requestDetails.requestId}`,
            'color: Khaki'
        )
        pendingRequests.splice(index, 1)
    }
}

/**
 * On Startup Callback
 * @function onStartup
 */
async function onStartup() {
    console.log('onStartup')
    const { session } = await chrome.storage.session.get(['session'])
    if (!session) {
        await chrome.storage.session.set({ session: {} })
        console.debug('onStartup: Initialized Empty session')
    }
    const { options } = await chrome.storage.sync.get(['options'])
    await updateIcon(options)
    if (typeof browser !== 'undefined') {
        console.log('Firefox CTX Menu Workaround')
        // console.debug('options:', options)
        if (options.contextMenu) {
            createContextMenus()
        }
    }
}

/**
 * On Installed Callback
 * @function onInstalled
 * @param {InstalledDetails} details
 */
async function onInstalled(details) {
    console.log('onInstalled:', details)
    // const uninstallURL = new URL('https://link-extractor.cssnr.com/uninstall/')
    const options = await setDefaultOptions({
        tempDisabled: false,
        ignoreProxy: false,
        defaultSave: true,
        confirmDelete: true,
        contextMenu: true,
        showUpdate: false,
        radioBackground: 'bgPicture',
        pictureURL: 'https://picsum.photos/1920/1080',
        videoURL: '',
    })
    console.debug('options:', options)
    await updateIcon(options)
    if (options.contextMenu) {
        createContextMenus()
    }
    const manifest = chrome.runtime.getManifest()
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const hasPerms = await checkPerms()
        if (hasPerms) {
            await chrome.runtime.openOptionsPage()
        } else {
            const url = chrome.runtime.getURL('/html/permissions.html')
            await chrome.tabs.create({ active: true, url })
        }
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        if (options.showUpdate) {
            if (manifest.version !== details.previousVersion) {
                const url = `${githubURL}/releases/tag/${manifest.version}`
                await chrome.tabs.create({ active: false, url })
            }
        }
    }
    // uninstallURL.searchParams.append('version', manifest.version)
    // console.log('uninstallURL:', uninstallURL.href)
    // await chrome.runtime.setUninstallURL(uninstallURL.href)
    await chrome.runtime.setUninstallURL(`${githubURL}/issues`)
}

/**
 * On Clicked Callback
 * @function onClicked
 * @param {OnClickData} ctx
 * @param {Tab} tab
 */
async function onClicked(ctx, tab) {
    console.debug('onClicked:', ctx, tab)
    if (ctx.menuItemId === 'openOptions') {
        await chrome.runtime.openOptionsPage()
    } else if (ctx.menuItemId === 'showPanel') {
        await showPanel()
    } else {
        console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
}

/**
 * On Command Callback
 * @function onCommand
 * @param {String} command
 */
async function onCommand(command) {
    console.debug(`onCommand: ${command}`)
    if (command === 'openOptions') {
        await chrome.runtime.openOptionsPage()
    } else if (command === 'showPanel') {
        await showPanel()
    } else {
        console.error(`Unknown command: ${command}`)
    }
}

/**
 * Message Callback - this function must not async
 * @function onMessage
 * @param {Object} message
 * @param {String} [message.badgeColor]
 * @param {String} [message.badgeText]
 * @param {Number} [message.tabId]
 * @param {Function} sendResponse
 * @param {MessageSender} sender
 */
function onMessage(message, sender, sendResponse) {
    console.debug('message, sender:', message, sender)
    const tabId = message.tabId || sender.tab?.id
    if ('badgeColor' in message && tabId) {
        console.debug(`tabId: ${tabId} color: ${message.badgeColor}`)
        chrome.action.setBadgeBackgroundColor({
            tabId: tabId,
            color: message.badgeColor,
        })
    }
    if ('badgeText' in message && tabId) {
        console.debug(`tabId: ${tabId} text: ${message.badgeText}`)
        chrome.action.setBadgeText({
            tabId: tabId,
            text: message.badgeText,
        })
    }
    if ('host' in message) {
        Hosts.get(message.host).then((creds) => sendResponse(creds))
        return true
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
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options' && oldValue && newValue) {
            if (oldValue.contextMenu !== newValue.contextMenu) {
                if (newValue?.contextMenu) {
                    console.info('Enabled contextMenu...')
                    createContextMenus()
                } else {
                    console.info('Disabled contextMenu...')
                    chrome.contextMenus?.removeAll()
                }
            }
            if (oldValue.tempDisabled !== newValue.tempDisabled) {
                console.debug('tempDisabled:', newValue.tempDisabled)
                // const color = newValue.tempDisabled ? 'red' : 'green'
                await updateIcon(newValue)
            }
        }
    }
}

/**
 * Permissions On Added Callback
 * @param {chrome.permissions} permissions
 */
export async function onAdded(permissions) {
    console.debug('onAdded', permissions)
    await updateIcon()
}

/**
 * Permissions On Removed Callback
 * @param {chrome.permissions} permissions
 */
export async function onRemoved(permissions) {
    console.debug('onRemoved', permissions)
    await updateIcon()
}

async function updateIcon(options) {
    if (!options) {
        const data = await chrome.storage.sync.get(['options'])
        options = data.options
    }
    console.debug('updateIcon options.tempDisabled:', options.tempDisabled)
    const hasPerms = await checkPerms()
    let color
    if (!hasPerms) {
        color = 'red'
    } else if (options.tempDisabled) {
        color = 'yellow'
    } else {
        color = 'green'
    }
    console.debug('color', color)

    if (color === 'red') {
        console.debug('Setting Red Icon')
        await chrome.action.setIcon({
            path: {
                16: '/images/logo-red16.png',
                32: '/images/logo-red32.png',
                48: '/images/logo-red48.png',
            },
        })
    } else if (color === 'yellow') {
        console.debug('Setting Yellow Icon')
        await chrome.action.setIcon({
            path: {
                16: '/images/logo-yellow16.png',
                32: '/images/logo-yellow32.png',
                48: '/images/logo-yellow48.png',
            },
        })
    } else if (color === 'green') {
        console.debug('Setting Green Icon')
        await chrome.action.setIcon({
            path: {
                16: '/images/logo16.png',
                32: '/images/logo32.png',
                48: '/images/logo48.png',
            },
        })
    } else {
        console.warn('Unknown Color for setIcon:', color)
    }
}

/**
 * Create Context Menus
 * @function createContextMenus
 */
function createContextMenus() {
    if (!chrome.contextMenus) {
        return console.debug('Skipping: chrome.contextMenus')
    }
    console.debug('createContextMenus')
    chrome.contextMenus.removeAll()
    /** @type {Array[String[], String, String, String]} */
    const contexts = [
        // [['all'], 'showPanel', 'Open Panel'],
        // [['all'], 'separator'],
        [['all'], 'openOptions', 'Auto Auth Options'],
    ]
    contexts.forEach(addContext)
}

/**
 * Add Context from Array
 * @function addContext
 * @param {[[ContextType],String,String,String]} context
 */
function addContext(context) {
    try {
        console.debug('addContext:', context)
        if (context[1] === 'separator') {
            context[1] = Math.random().toString().substring(2, 7)
            context.push('separator', 'separator')
        }
        chrome.contextMenus.create({
            contexts: context[0],
            id: context[1],
            title: context[2],
            type: context[3],
        })
    } catch (e) {
        console.log(`%cError Adding Context: ${e.message}`, 'color: Red', e)
    }
}

/**
 * Set Default Options
 * @function setDefaultOptions
 * @param {Object} defaultOptions
 * @return {Promise<Object.<String, String|Boolean>>}
 */
async function setDefaultOptions(defaultOptions) {
    console.log('setDefaultOptions', defaultOptions)
    // let { sites } = await chrome.storage.sync.get(['sites'])
    // if (!sites) {
    //     await chrome.storage.sync.set({ sites: {} })
    //     console.debug('Initialized Empty sync sites')
    // }
    const { session } = await chrome.storage.session.get(['session'])
    if (!session) {
        await chrome.storage.session.set({ session: {} })
        console.debug('setDefaultOptions: Initialized Empty session')
    }
    let { options } = await chrome.storage.sync.get(['options'])
    options = options || {}
    let changed = false
    for (const [key, value] of Object.entries(defaultOptions)) {
        // console.log(`${key}: default: ${value} current: ${options[key]}`)
        if (options[key] === undefined) {
            changed = true
            options[key] = value
            console.log(`%cSet ${key}:`, 'color: LimeGreen', value)
        }
    }
    if (changed) {
        await chrome.storage.sync.set({ options })
        console.log('changed:', options)
    }
    return options
}
