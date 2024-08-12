[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/xxxChromeIDxxx?logo=google&logoColor=white&label=users)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/auto-auth?logo=mozilla&label=users)](https://addons.mozilla.org/addon/auto-auth)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/xxxChromeIDxxx?logo=google&logoColor=white)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/auto-auth?logo=mozilla&logoColor=white)](https://addons.mozilla.org/addon/auto-auth)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/auto-auth?style=flat&logo=github&logoColor=white)](https://github.com/cssnr/auto-auth/stargazers)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/xxxChromeIDxxx?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/auto-auth?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/auto-auth)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/auto-auth?logo=github&logoColor=white)](https://github.com/cssnr/auto-auth/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/cssnr/auto-auth/build.yaml?logo=github&logoColor=white&label=build)](https://github.com/cssnr/auto-auth/actions/workflows/build.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/auto-auth/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/cssnr/auto-auth/actions/workflows/test.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_auto-auth&metric=alert_status&label=quality)](https://sonarcloud.io/summary/overall?id=cssnr_auto-auth)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/auto-auth?logo=github&logoColor=white&label=updated)](https://github.com/cssnr/auto-auth/graphs/commit-activity)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/auto-auth?logo=htmx&logoColor=white)](https://github.com/cssnr/auto-auth)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Auto Auth

Modern Chrome Web Extension and Firefox Browser Addon for Automatic Basic HTTP Authentication with many Options and
Features.

* [Install](#Install)
* [Features](#Features)
    - [Upcoming Features](#Upcoming-Features)
    - [Known Issues](#Known-Issues)
* [Configuration](#Configuration)
* [Migration](#Migration)
* [Security](#Security)
* [Support](#Support)
* [Development](#Development)
    - [Building](#Building)
* [Contributing](#Contributing)

## Install

> [!WARNING]  
> Extension not yet published to Google or Mozilla.  
> To install you must download a [Release from GitHub](https://github.com/cssnr/auto-auth/releases/latest).

* [Google Chrome Web Store](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
* [Mozilla Firefox Add-ons](https://addons.mozilla.org/addon/auto-auth)

[![Chrome](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/chrome_48.png)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Firefox](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/firefox_48.png)](https://addons.mozilla.org/addon/auto-auth)
[![Edge](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/edge_48.png)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Brave](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/brave_48.png)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Opera](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/opera_48.png)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
[![Chromium](https://raw.githubusercontent.com/smashedr/logo-icons/master/browsers/chromium_48.png)](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)

All **Chromium** Based Browsers can install the extension from
the [Chrome Web Store](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx).

## Features

- Save Logins for HTTP Basic Authentication
- Automatically Login with Saved Credentials
- Option to Ignore Specific Hosts
- Notification on Invalid Credentials
- View, Delete and Edit Saved Credentials
- Option to Ignore Proxy Authentication
- Option to Temporarily Disable
- Ability to Import/Export Credentials
- Toolbar Status for Enabled Hosts
- Icon Colors for Extension Status

### Upcoming Features

- Save Multiple Credentials for a Single Host
- Manually Add Saved Credentials
- Toggle to Match Any Port for Host

Long-term Goals for Improved Security:

- Add Optional Password Encryption Feature
- Add a Sync Service for Cross-Browser Synchronization

> [!TIP]
> **Don't see your feature here?**
> Request one on
> the [Feature Request Discussion](https://github.com/cssnr/auto-auth/discussions/categories/feature-requests).

### Known Issues

* Only allows saving 1 set of credentials per host
* Most browsers will offer to save passwords on login and edit 

> [!TIP]
> **Don't see your issue here?**
> Open one on the [Issues](https://github.com/cssnr/auto-auth/issues).

## Configuration

You can pin the Addon by clicking the `Puzzle Piece`, find the Auto Auth icon, then;  
**Chrome,** click the `Pin` icon.  
**Firefox,** click the `Settings Wheel` and `Pin to Toolbar`.

To open the options, click on the icon (from above) then click `Open Options`.  
You can also access `Options` through the right-click context menu (enabled by default).

## Migration

Migration Guides from Other Web Extensions.

### AutoAuth

Migration from: [steffanschlein/AutoAuth/](https://github.com/steffanschlein/AutoAuth/)

1. Open Addons Management (about:addons) `Ctrl+Shift+A`
2. Find AutoAuth, click the 3 dots, then click Options
3. Open Developer Tools `Ctrl+Shift+I` and go to Console tab
4. Enter the following code: `await browser.storage.local.get() `
5. Right-click on the `Object` and choose **Copy Object**
6. Paste the results into a text file and save it
7. Go to the Options Page (for this extension) and click Import
8. Choose the file from step #6 and click Open

You should now see all the credentials in the table on the Options Page.

## Security

Since there is no API to manage or store credentials securely, usernames and passwords are stored in the web
extension's [sync storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync). This
will sync your credentials to all browsers you are logged into if sync is enabled for addons. Therefore, any computers
you use a synced browser on will write the credentials to the file system in plain text.

If there is enough popularity/requests for these features, there are a couple options to mitigate this:

- Option to switch between sync and local storage to limit credentials to a single computer.
- Option to encrypt credentials using a password that must be entered once every session.

## Support

For help using the web extension, utilize any these resources:

- Documentation: https://auto-auth.cssnr.com/docs/
- Q&A Discussion: https://github.com/cssnr/auto-auth/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/auto-auth/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, use:

- Report an Issue: https://github.com/cssnr/auto-auth/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: https://cssnr.github.io/feedback

Logs can be found inspecting the page (Ctrl+Shift+I), clicking on the Console, and;
Firefox: toggling Debug logs, Chrome: toggling Verbose from levels dropdown.

To support this project, see the [Contributing](#Contributing) section at the bottom.

# Development

**Quick Start**

First, clone (or download) this repository and change into the directory.

Second, install the dependencies:

```shell
npm install
```

Finally, to run Chrome or Firefox with web-ext, run one of the following:

```shell
npm run chrome
npm run firefox
```

Additionally, to Load Unpacked/Temporary Add-on make a `manifest.json` and run from the [src](src) folder, run one of
the following:

```shell
npm run manifest:chrome
npm run manifest:firefox
```

Chrome: [https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)  
Firefox: [https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

For more information on
web-ext, [read this documentation](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/).  
To pass additional arguments to an `npm run` command, use `--`.  
Example: `npm run chrome -- --chromium-binary=...`

## Building

Install the requirements and copy libraries into the `src/dist` directory by running `npm install`.
See [gulpfile.js](gulpfile.js) for more information on `postinstall`.

```shell
npm install
```

To create a `.zip` archive of the [src](src) directory for the desired browser run one of the following:

```shell
npm run build
npm run build:chrome
npm run build:firefox
```

For more information on building, see the scripts section in the [package.json](package.json) file.

### Chrome Setup

1. Build or Download a [Release](https://github.com/cssnr/auto-auth/releases).
1. Unzip the archive, place the folder where it must remain and note its location for later.
1. Open Chrome, click the `3 dots` in the top right, click `Extensions`, click `Manage Extensions`.
1. In the top right, click `Developer Mode` then on the top left click `Load unpacked`.
1. Navigate to the folder you extracted in step #3 then click `Select Folder`.

### Firefox Setup

1. Build or Download a [Release](https://github.com/cssnr/auto-auth/releases).
1. Unzip the archive, place the folder where it must remain and note its location for later.
1. Go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on...`
1. Navigate to the folder you extracted earlier, select `manifest.json` then click `Select File`.
1. Optional: open `about:config` search for `extensions.webextensions.keepStorageOnUninstall` and set to `true`.

If you need to test a restart, you must pack the addon. This only works in ESR, Development, or Nightly.
You may also use an Unbranded
Build: [https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds](https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds)

1. Run `npm run build:firefox` then use `web-ext-artifacts/{name}-firefox-{version}.zip`.
1. Open `about:config` search for `xpinstall.signatures.required` and set to `false`.
1. Open `about:addons` and drag the zip file to the page or choose Install from File from the Settings wheel.

# Contributing

Currently, the best way to contribute to this project is to give a 5-star rating
on [Google](https://chromewebstore.google.com/detail/auto-auth/xxxChromeIDxxx)
or [Mozilla](https://addons.mozilla.org/addon/auto-auth) and to star this project on GitHub.

Other Web Extensions I have created and published:

- [Link Extractor](https://github.com/cssnr/link-extractor)
- [Open Links in New Tab](https://github.com/cssnr/open-links-in-new-tab)
- [HLS Video Downloader](https://github.com/cssnr/hls-video-downloader)
- [SMWC Web Extension](https://github.com/cssnr/smwc-web-extension)
- [PlayDrift Extension](https://github.com/cssnr/playdrift-extension)
- [ASN Plus](https://github.com/cssnr/asn-plus)
- [Aviation Tools](https://github.com/cssnr/aviation-tools)
- [Text Formatter](https://github.com/cssnr/text-formatter)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
