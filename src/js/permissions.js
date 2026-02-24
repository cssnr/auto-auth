// JS for permissions.html

import { checkPerms, grantPerms, linkClick, onRemoved, updateManifest } from './export.js'

chrome.permissions.onAdded.addListener(onAdded)
chrome.permissions.onRemoved.addListener(onRemoved)

document.addEventListener('DOMContentLoaded', domContentLoaded)
document
    .querySelectorAll('.grant-permissions')
    .forEach((el) => el.addEventListener('click', grantPerms))
document
    .querySelectorAll('a[href]')
    .forEach((el) => el.addEventListener('click', linkClick))

/**
 * DOMContentLoaded
 * @function domContentLoaded
 */
async function domContentLoaded() {
    console.debug('domContentLoaded')
    // noinspection ES6MissingAwait
    updateManifest()
    checkPerms().then((hasPerms) => {
        if (!hasPerms) console.log('%cMissing Host Permissions', 'color: Red')
    })
}

/**
 * Permissions On Added Callback
 * @param permissions
 */
async function onAdded(permissions) {
    console.debug('onAdded', permissions)
    const hasPerms = await checkPerms()
    if (hasPerms) {
        if (document.hasFocus()) {
            await chrome.runtime.openOptionsPage()
        }
        window.close()
    }
}
