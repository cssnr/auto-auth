// Common JS for Extension Pages

import { showToast } from './export.js'

document.querySelectorAll('.form-control').forEach((el) => {
    el.addEventListener('focus', () => el.classList.remove('is-invalid'))
})

// noinspection TypeScriptUMDGlobal
if (typeof ClipboardJS !== 'undefined') {
    // noinspection TypeScriptUMDGlobal
    const clipboard = new ClipboardJS(
        '[data-clipboard-text],[data-clipboard-target]'
    )
    clipboard.on('success', function (event) {
        // console.debug('clipboard.success:', event)
        const text = event.text.trim()
        console.debug(`text: "${text}"`)
        // noinspection JSUnresolvedReference
        if (event.trigger.dataset.toast) {
            // noinspection JSUnresolvedReference
            showToast(event.trigger.dataset.toast, 'success')
        } else {
            showToast('Copied to Clipboard', 'success')
        }
    })
    clipboard.on('error', function (event) {
        console.log('clipboard.error:', event)
        showToast('Clipboard Copy Failed', 'warning')
    })
}

const backToTop = document.getElementById('back-to-top')
if (backToTop) {
    window.addEventListener('scroll', debounce(onScroll))
    backToTop.addEventListener('click', () => {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    })
}

/**
 * On Scroll Callback
 * @function onScroll
 */
function onScroll() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        backToTop.style.display = 'block'
    } else {
        backToTop.style.display = 'none'
    }
}

/**
 * DeBounce Function
 * @function debounce
 * @param {Function} fn
 * @param {Number} timeout
 */
function debounce(fn, timeout = 250) {
    let timeoutID
    return (...args) => {
        clearTimeout(timeoutID)
        timeoutID = setTimeout(() => fn(...args), timeout)
    }
}
