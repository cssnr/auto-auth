// JS for panel.html

document.addEventListener('DOMContentLoaded', domContentLoaded)
document.getElementById('close').addEventListener('click', closePanel)

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    const { options } = await chrome.storage.sync.get(['options'])
    console.debug('options:', options)
}

function closePanel(event) {
    console.debug('closePanel:', event)
    event.preventDefault()
    window.close()
}
