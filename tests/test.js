const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const sourceDir = 'src'
const ssDir = 'tests/screenshots'

let count = 1

// if (fs.existsSync(ssDir)) {}
fs.rmSync(ssDir, { recursive: true, force: true })
fs.mkdirSync(ssDir)

/**
 * @function screenshot
 * @param {String} name
 * @param {Object} [options]
 * @return {Object}
 */
function ssOptions(name, options = {}) {
    const n = count.toString().padStart(2, '0')
    count++
    const opts = { path: `${ssDir}/${n}_${name}.png` }
    Object.assign(opts, options)
    console.log('options:', opts)
    return opts
}

async function scrollPage(page) {
    await page.evaluate(() => {
        window.scrollBy({
            top: window.innerHeight,
            left: 0,
            behavior: 'instant',
        })
    })
    await new Promise((resolve) => setTimeout(resolve, 500))
}

/**
 * @function getPage
 * @param {puppeteer.Browser} browser
 * @param {String} name
 * @param {String} [size]
 * @return {Promise<puppeteer.Page>}
 */
async function getPage(browser, name, size) {
    console.debug(`getPage: ${name}`, size)
    const target = await browser.waitForTarget(
        (target) => target.type() === 'page' && target.url().endsWith(name)
    )
    const page = await target.asPage()
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ])
    if (size) {
        const [width, height] = size.split('x').map((x) => parseInt(x))
        await page.setViewport({ width, height })
    }
    console.debug(`Adding Logger: ${name}`)
    page.on('console', (msg) => console.log(`console: ${name}:`, msg.text()))
    return page
}

;(async () => {
    // Get Browser
    const pathToExtension = path.join(process.cwd(), sourceDir)
    console.log('pathToExtension:', pathToExtension)
    const browser = await puppeteer.launch({
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
        dumpio: true,
        // headless: false,
        // slowMo: 50,
    })
    console.log('browser:', browser)

    // Get Worker
    const workerTarget = await browser.waitForTarget(
        (target) =>
            target.type() === 'service_worker' &&
            target.url().endsWith('service-worker.js')
    )
    const worker = await workerTarget.worker()
    console.log('worker:', worker)

    // Popup
    await worker.evaluate('chrome.action.openPopup();')
    const popup = await getPage(browser, 'popup.html')
    console.log('popup:', popup)
    await popup.waitForNetworkIdle()
    await popup.screenshot(ssOptions('popup'))
    await popup.locator('[href="../html/options.html"]').click()

    // Options
    await worker.evaluate('chrome.runtime.openOptionsPage();')
    const options = await getPage(browser, 'options.html', '600x900')
    console.log('options:', options)
    await options.waitForNetworkIdle()
    await options.screenshot(ssOptions('options'))

    await options.locator('#tempDisabled').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('disabled'))

    await options.locator('#tempDisabled').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('enabled'))

    const [fileChooser] = await Promise.all([
        options.waitForFileChooser(),
        options.click('#import-hosts'),
    ])
    await fileChooser.accept(['./tests/secrets.txt'])
    await scrollPage(options)
    await options.screenshot(ssOptions('import'))

    await options.locator('[title="Delete"][data-value="cssnr.com"]').click()
    // await options.evaluate((selector) => {
    //     document.querySelectorAll(selector)[1].click()
    // }, 'a[title="Delete"]')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('delete'))

    await options.locator('#confirm-delete').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('delete-confirm'))

    await options.locator('[title="Edit"][data-value="httpbin.org"]').click()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('edit'))

    await options.locator('#username').fill('changed')
    await options.keyboard.press('Enter')
    await new Promise((resolve) => setTimeout(resolve, 500))
    await options.screenshot(ssOptions('edit-save'))

    // Page
    const page = await browser.newPage()
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ])
    page.on('console', (msg) => console.log(`console:`, msg.text()))
    console.log('page:', page)

    // Auth
    try {
        // Intercepting auth throws `Error: net::ERR_ABORTED`
        await page.goto('https://authenticationtest.com/HTTPAuth/')
    } catch (e) {} // eslint-disable-line no-empty
    await page.waitForNetworkIdle()
    await page.screenshot(ssOptions('success'))

    try {
        // Intercepting auth throws `Error: net::ERR_ABORTED`
        await page.goto('https://httpbin.org/basic-auth/guest/guest')
    } catch (e) {} // eslint-disable-line no-empty
    await page.waitForNetworkIdle()
    await page.screenshot(ssOptions('auth'))

    await page.locator('#username').fill('guest')
    await page.keyboard.press('Enter')
    await page.waitForNetworkIdle()
    await page.screenshot(ssOptions('httpbin'))

    await browser.close()
})()
