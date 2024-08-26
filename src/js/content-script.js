// JS Content Script

// console.log('%cAuto Auth: content-script.js', 'color: Lime')

const url = new URL(window.location)
let tabEnabled = false

if (!chrome.storage.onChanged.hasListener(onChanged)) {
    // console.debug('Adding storage.onChanged Listener')
    chrome.storage.onChanged.addListener(onChanged)
}

;(async () => {
    // const { options, sites } = await chrome.storage.sync.get([
    //     'options',
    //     'sites',
    // ])
    // console.debug('options, sites:', options, sites)
    // const { sites } = await chrome.storage.sync.get(['sites'])
    const creds = await chrome.runtime.sendMessage({ host: url.host })
    // console.debug('creds:', creds)
    if (creds) {
        tabEnabled = true
        if (creds === 'ignored') {
            console.debug('%cSite is currently ignored.', 'color: Yellow')
            await chrome.runtime.sendMessage({
                badgeText: 'Off',
                badgeColor: 'yellow',
            })
        } else {
            console.debug('%cFound credentials for site.', 'color: LimeGreen')
            await chrome.runtime.sendMessage({
                badgeText: 'On',
                badgeColor: 'green',
            })
        }
    }
})()

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
async function onChanged(changes, namespace) {
    // console.debug('onChanged:', changes, namespace)
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options') {
            console.debug('options', oldValue, newValue)
        }
        if (namespace === 'sync' && key.startsWith(url.host[0])) {
            // console.debug('sites', oldValue, newValue)
            const hosts = newValue[url.host[0]] || {}
            if (tabEnabled && !(url.host in hosts)) {
                await chrome.runtime.sendMessage({
                    badgeText: '',
                })
            }
        }
    }
}
