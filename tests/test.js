const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const sourceDir = 'src'
const screenshotsDir = 'tests/screenshots'

/** @type {import('puppeteer').Browser}*/
let browser
/** @type {import('puppeteer').Page}*/
let page

let count = 1

/**
 * @function screenshot
 * @param {String} name
 * @return {Promise<void>}
 */
async function screenshot(name) {
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir)
    }
    const n = count.toString().padStart(2, '0')
    await page.screenshot({ path: `${screenshotsDir}/${n}_${name}.png` })
    count++
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
 * @param {String} name
 * @param {Boolean=} log
 * @param {String=} size
 * @return {Promise<puppeteer.Page>}
 */
async function getPage(name, log, size) {
    console.debug(`getPage: ${name}`, log, size)
    const target = await browser.waitForTarget(
        (target) => target.type() === 'page' && target.url().endsWith(name)
    )
    page = await target.asPage()
    await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: 'dark' },
    ])
    if (size) {
        const [width, height] = size.split('x').map((x) => parseInt(x))
        await page.setViewport({ width, height })
    }
    if (log) {
        console.debug(`Adding Logger: ${name}`)
        page.on('console', (msg) =>
            console.log(`console: ${name}:`, msg.text())
        )
    }
    return page
}

;(async () => {
    const pathToExtension = path.join(process.cwd(), sourceDir)
    console.log('pathToExtension:', pathToExtension)
    browser = await puppeteer.launch({
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
        dumpio: true,
        // headless: false,
        // slowMo: 50,
    })
    console.log('browser:', browser)

    // Get Service Worker
    const workerTarget = await browser.waitForTarget(
        (target) =>
            target.type() === 'service_worker' &&
            target.url().endsWith('service-worker.js')
    )
    const worker = await workerTarget.worker()
    console.log('worker:', worker)

    // Popup
    await worker.evaluate('chrome.action.openPopup();')
    page = await getPage('popup.html')
    console.log('page:', page)
    await page.waitForNetworkIdle()
    await screenshot('popup')
    await page.locator('[href="../html/options.html"]').click()

    // Options
    // await worker.evaluate('chrome.runtime.openOptionsPage();')
    page = await getPage('options.html')
    console.log('page:', page)
    await page.waitForNetworkIdle()
    await screenshot('options')

    // await page.locator('#tempDisabled').click()
    // await new Promise((resolve) => setTimeout(resolve, 500))
    // await screenshot('options')

    // await page.locator('#tempDisabled').click()
    // await new Promise((resolve) => setTimeout(resolve, 250))

    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('#import-hosts'),
    ])
    await fileChooser.accept(['./tests/secrets.txt'])
    await scrollPage(page)
    await screenshot('options')

    await page.locator('[title="Delete"]').click()
    // await page.evaluate((selector) => {
    //     document.querySelectorAll(selector)[1].click()
    // }, 'a[title="Delete"]')
    await new Promise((resolve) => setTimeout(resolve, 250))
    await screenshot('delete')

    await page.locator('#confirm-delete').click()
    await new Promise((resolve) => setTimeout(resolve, 250))
    await screenshot('delete-confirm')

    await page.locator('[title="Edit"]').click()
    await new Promise((resolve) => setTimeout(resolve, 250))
    await screenshot('edit')

    await page.locator('#username').fill('success')
    await page.keyboard.press('Enter')
    await new Promise((resolve) => setTimeout(resolve, 250))
    await screenshot('edit-save')

    // Auth
    // TODO: Open Bug as this throws `Error: net::ERR_ABORTED`
    // await page.goto('https://httpbin.org/basic-auth/guest/guest')
    // await page.waitForNavigation()
    // await screenshot('auth')

    await page.close()
    await browser.close()
})()
