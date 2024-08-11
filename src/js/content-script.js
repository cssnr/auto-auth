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
    const { sites } = await chrome.storage.sync.get(['sites'])
    if (url.host in sites) {
        tabEnabled = true
        console.debug(
            '%cFound Credentials for Current Site.',
            'color: LimeGreen'
        )
        await chrome.runtime.sendMessage({
            badgeText: 'On',
            badgeColor: 'green',
        })
    }
})()

/**
 * On Changed Callback
 * @function onChanged
 * @param {Object} changes
 * @param {String} namespace
 */
async function onChanged(changes, namespace) {
    console.debug('onChanged:', changes, namespace)
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (namespace === 'sync' && key === 'options') {
            console.debug('options', oldValue, newValue)
        }
        if (namespace === 'sync' && key === 'sites') {
            // console.debug('sites', oldValue, newValue)
            if (tabEnabled && !(url.host in newValue)) {
                await chrome.runtime.sendMessage({
                    badgeText: '',
                })
            }
        }
    }
}
