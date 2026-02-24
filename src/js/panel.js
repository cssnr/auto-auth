// JS for panel.html

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.close-panel')
    .forEach((el) => el.addEventListener('click', closePanel))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    // Note: This can not be reliably set in: export.js > openExtPanel
    chrome.windows.getCurrent().then((window) => {
        chrome.storage.local.set({ lastPanelID: window.id }).then(() => {
            console.debug(`%c Set lastPanelID: ${window.id}`, 'color: Aqua')
        })
    })
    chrome.storage.sync.get(['options']).then((items) => {
        console.debug('options:', items.options)
    })
}

/**
 * Close Panel Click Callback
 * @function closePanel
 * @param {Event} [event]
 */
function closePanel(event) {
    console.debug('closePanel:', event)
    event?.preventDefault()
    window.close()
}
