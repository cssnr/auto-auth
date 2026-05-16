[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/gpoiggobidhogpmmlakahiaaegibnogm?logo=google&logoColor=white&label=users)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/auto-auth?logo=mozilla&label=users)](https://addons.mozilla.org/addon/auto-auth)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/gpoiggobidhogpmmlakahiaaegibnogm?logo=google&logoColor=white)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/auto-auth?logo=mozilla&logoColor=white)](https://addons.mozilla.org/addon/auto-auth)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/gpoiggobidhogpmmlakahiaaegibnogm?label=chrome&logo=googlechrome)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/auto-auth?label=firefox&logo=firefox)](https://addons.mozilla.org/addon/auto-auth)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/auto-auth?logo=github)](https://github.com/cssnr/auto-auth/releases/latest)
[![GitHub Locales](https://img.shields.io/github/directory-file-count/cssnr/auto-auth/src/locales?type=file&extension=yaml&logo=libretranslate&label=locales)](https://github.com/cssnr/auto-auth/tree/master/src/locales)
[![Deployment Chrome](https://img.shields.io/github/deployments/cssnr/auto-auth/chrome?logo=googlechrome&logoColor=white&label=chrome)](https://github.com/cssnr/auto-auth/deployments/chrome)
[![Deployment Mozilla](https://img.shields.io/github/deployments/cssnr/auto-auth/mozilla?logo=firefox&logoColor=white&label=mozilla)](https://github.com/cssnr/auto-auth/deployments/mozilla)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_auto-auth&metric=alert_status)](https://sonarcloud.io/summary/overall?id=cssnr_auto-auth)
[![Workflow Build](https://img.shields.io/github/actions/workflow/status/cssnr/auto-auth/build.yaml?logo=norton&logoColor=white&label=build)](https://github.com/cssnr/auto-auth/actions/workflows/build.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/auto-auth/lint.yaml?logo=norton&logoColor=white&label=lint)](https://github.com/cssnr/auto-auth/actions/workflows/lint.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/auto-auth?logo=listenhub&label=updated)](https://github.com/cssnr/auto-auth/pulse)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/auto-auth?logo=buffer&label=repo%20size)](https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/auto-auth?logo=devbox)](https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme)
[![GitHub Contributors](https://img.shields.io/github/contributors-anon/cssnr/auto-auth?logo=southwestairlines)](https://github.com/cssnr/auto-auth/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/cssnr/auto-auth?logo=codeforces&logoColor=white)](https://github.com/cssnr/auto-auth/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/auto-auth?logo=theconversation)](https://github.com/cssnr/auto-auth/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/auto-auth?style=flat&logo=forgejo&logoColor=white)](https://github.com/cssnr/auto-auth/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/auto-auth?style=flat&logo=gleam&logoColor=white)](https://github.com/cssnr/auto-auth/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=apachespark&logoColor=white&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Auto Auth

<a title="Auto Auth" href="https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme" target="_blank">
<img alt="Auto Auth" align="right" width="128" height="auto" src="https://raw.githubusercontent.com/cssnr/auto-auth/master/src/assets/icon.svg"></a>

- [Install](#install)
- [Features](#features)
  - [Languages](#languages)
  - [Upcoming Features](#upcoming-features)
  - [Known Issues](#known-Issues)
- [Migration](#migration)
  - [MultiPass](#multipass)
  - [AutoAuth](#autoauth)
  - [Basic Authentication](#basic-authentication)
  - [Other or Manual](#other-or-manual)
- [Security](#security)
- [Support](#support)
- [Contributing](#contributing)

Modern Chrome Web Extension and Firefox Browser Addon for Automatic Basic HTTP Authentication with many Options and Features.

To take it for a test drive, [install](#Install) the addon and head over to: https://authenticationtest.com/HTTPAuth/  
Then enter the username `user` and password `pass`.

> [!TIP]  
> This is the new TypeScript+Vue branch.  
> For the **deprecated** JavaScript version, see the [legacy](https://github.com/cssnr/cache-cleaner/tree/legacy) branch.

## Install

- [Google Chrome Web Store](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
- [Mozilla Firefox Add-ons](https://addons.mozilla.org/addon/auto-auth)

[![Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_48x48.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/firefox/firefox_48x48.png)](https://addons.mozilla.org/addon/auto-auth)
[![Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/edge/edge_48x48.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Brave](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/brave/brave_48x48.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/opera/opera_48x48.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
[![Chromium](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chromium/chromium_48x48.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)

All **Chromium** Based Browsers can install the extension from
the [Chrome Web Store](https://chromewebstore.google.com/detail/auto-auth/gpoiggobidhogpmmlakahiaaegibnogm).

<details open><summary>📷 Mozilla Firefox Android QR Code</summary>

[![QR Code Firefox](https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/auto-auth/qr-code-firefox.png)](https://addons.mozilla.org/addon/auto-auth)

</details>
<details><summary>📷 Google Chrome Web Store QR Code</summary>

[![QR Code Chrome](https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/auto-auth/qr-code-chrome.png)](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)

</details>

## Features

- Save Logins for HTTP Basic Authentication
- Automatically Login with Saved Credentials
- Option to Ignore Hosts and Save for Session
- View, Delete and Edit Credentials from the UI
- Includes Options, Side Panel, Popup and Panel
- Custom Column Visibility with Click-to-Edit
- Option to Ignore Proxy Authentication
- Option to Temporarily Disable
- Ability to Import/Export Credentials
- Supports Migrations from Other Extensions
- Toolbar Status for Enabled Hosts
- Icon Colors for Extension Status

### Languages

The extension is localized in the following languages:

- Chinese (China) `zh_CN` - 中文（简体）
- English `en` - English
- French `fr` - Français
- German `de` - Deutsch
- Japanese `ja` - 日本語
- Korean `ko` - 한국어
- Portuguese (Brazil) `pt_BR` - Português (Brasil)
- Portuguese (Portugal) `pt_PT` - Português (Portugal)
- Russian `ru` - Русский
- Spanish `es_419` - Español

The only way to change the language is to change your browser's language and restart the browser.

To view or edit the locales, see the related file in the [src/locales](src/locales) directory.

### Upcoming Features

- Save Multiple Credentials for a Single Host
- Manually Add Saved Credentials
- Toggle to Match Any Port for Host

Long-term Goals for Improved Security:

- Add Optional Password Encryption Feature

> [!TIP]  
> **Don't see your feature here?**
> Submit a [Feature Request](https://github.com/cssnr/auto-auth/issues/new?template=1-feature.yaml).

### Known Issues

- Usernames with the character `:` will not work.
- Only allows saving 1 set of credentials per host.
- Many browsers will offer to save passwords on login and edit.
- Incognito and Private Browsing will not allow logging into new sites.
  - You must save the credentials first or add them manually.
- A 401 response from a Service Worker is not properly intercepted:
  - Firefox: Shows a generic 401 page, use `Ctrl+F5`
    - Once credentials are saved, requests will work as normal.
  - Chrome: Shows a default credentials prompt, Cancel and press `Ctrl+F5`
    - This behavior may continue after saving credentials.

> [!TIP]  
> **Don't see your issue here?**
> Open a [New Issues](https://github.com/cssnr/auto-auth/issues).

## Migration

Migration Guides from Other Web Extensions and manual import instructions.

[MultiPass](#MultiPass) | [AutoAuth](#AutoAuth) | [Basic Authentication](#Basic-Authentication) | [Other or Manual](#Other-or-Manual)

### MultiPass

Firefox/Chrome Migration from [krtek4/MultiPass](https://github.com/krtek4/MultiPass)

1. Open the MultiPass Options
2. Click: `Download credentials as JSON file.`
3. Open the Auto Auth Options and click `Import File`
4. Select the file from exported in Step #2

### AutoAuth

Firefox Migration from: [steffanschlein/AutoAuth](https://github.com/steffanschlein/AutoAuth)

1. Open Addons Management (about:addons) `Ctrl+Shift+A`
2. Find AutoAuth, click the 3 dots, then click Options
3. Open Developer Tools `Ctrl+Shift+I` and go to Console tab
4. Enter the following code: `await browser.storage.local.get()`
5. Right-click on the resulting output and choose `Copy Object`
6. Go to the Options Page (for this extension) and click `Import Text`
7. Paste the copied text into the textarea and click `Import`

### Basic Authentication

Chrome Migration from: [Basic Authentication](https://chromewebstore.google.com/detail/nanfgbiblbcagfodkfeinbbhijihckml)

1. Go To this URL: `chrome-extension://nanfgbiblbcagfodkfeinbbhijihckml/options.html`
2. Open Developer Tools `Ctrl+Shift+I` and go to Console tab
3. Enter the following code: `await chrome.storage.local.get()`
4. Right-click on the resulting output and choose `Copy Object`
5. Go to the Options Page (for this extension) and click `Import Text`
6. Paste the copied text into the textarea and click `Import`

Note: Basic Authentication uses url match patterns vs hostnames. This import will attempt to parse the match pattern to
a hostname; however, if the full hostname is not provided, may not import correctly. You can always edit the credentials
manually or save new ones on the next login.

### Other or Manual

To manually migrate from other data exports you need to convert the data into a compatible JSON format.
You can do this yourself, or get AI to convert the data format for you. Convert the data to this JSON format:

```json
{
  "example.com": "username:password",
  "ignored.example.com": "ignored"
}
```

To import the data, visit the extension's Options Page, click `Import Text` and paste the JSON text.

You can also [request a migration](https://github.com/cssnr/auto-auth/issues/new?template=1-feature.yaml) be added
for your extension. If it is popular enough, it might get added.

## Security

Since there is no API to manage or store credentials securely, usernames and passwords are stored in the web
extension's [sync storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync).
This will sync your credentials to all browsers you are logged into if sync is enabled for addons. Therefore, any
computers you use a synced browser on will write the credentials to the file system in plain text.

If there is enough popularity/requests for these features, there are a couple options to mitigate this:

- Option to switch between sync and local storage to limit credentials to a single computer.
- Option to encrypt credentials using a password that must be entered once every session.

For more information see the [PRIVACY.md](PRIVACY.md).

## Support

Logs can be found inspecting the page (Ctrl+Shift+I), clicking on the Console, and;
Firefox: toggling Debug logs, Chrome: toggling Verbose from levels dropdown.

If you run into any issues or need help getting started, please do one of the following:

- Report an Issue: <https://github.com/cssnr/auto-auth/issues>
- Q&A Discussion: <https://github.com/cssnr/auto-auth/discussions/categories/q-a>
- Request a Feature: <https://github.com/cssnr/auto-auth/issues/new?template=1-feature.yaml>
- Chat with us on Discord: <https://discord.gg/wXy6m2X8wY>

[![Features](https://img.shields.io/badge/features-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/cssnr/auto-auth/issues/new?template=1-feature.yaml)
[![Issues](https://img.shields.io/badge/issues-red?style=for-the-badge&logo=southwestairlines&logoColor=white)](https://github.com/cssnr/auto-auth/issues)
[![Discussions](https://img.shields.io/badge/discussions-blue?style=for-the-badge&logo=livechat&logoColor=white)](https://github.com/cssnr/auto-auth/discussions)
[![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wXy6m2X8wY)

# Contributing

For instructions on building or developing, see the [CONTRIBUTING.md](#contributing-ov-file).

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

Additionally, you can give a 5-star rating
on [Google](https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm)
or [Mozilla](https://addons.mozilla.org/addon/auto-auth) and star this project on GitHub.

Other Web Extensions I have created and published:

- [Link Extractor](https://github.com/cssnr/link-extractor?tab=readme-ov-file#readme)
- [Open Links in New Tab](https://github.com/cssnr/open-links-in-new-tab?tab=readme-ov-file#readme)
- [Auto Auth](https://github.com/cssnr/auto-auth?tab=readme-ov-file#readme)
- [Cache Cleaner](https://github.com/cssnr/cache-cleaner?tab=readme-ov-file#readme)
- [HLS Video Downloader](https://github.com/cssnr/hls-video-downloader?tab=readme-ov-file#readme)
- [Zipline Extension](https://github.com/cssnr/zipline-extension?tab=readme-ov-file#readme)
- [Obtainium Extension](https://github.com/cssnr/obtainium-extension?tab=readme-ov-file#readme)
- [SMWC Web Extension](https://github.com/cssnr/smwc-web-extension?tab=readme-ov-file#readme)
- [PlayDrift Extension](https://github.com/cssnr/playdrift-extension?tab=readme-ov-file#readme)
- [ASN Plus](https://github.com/cssnr/asn-plus?tab=readme-ov-file#readme)
- [Aviation Tools](https://github.com/cssnr/aviation-tools?tab=readme-ov-file#readme)
- [Text Formatter](https://github.com/cssnr/text-formatter?tab=readme-ov-file#readme)
- [GeoImage](https://github.com/cssnr/geo-image?tab=readme-ov-file#readme)
- [New Tab](https://github.com/cssnr/new-tab?tab=readme-ov-file#readme)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

<a href="https://github.com/cssnr/auto-auth/stargazers">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cssnr/auto-auth&type=date&legend=bottom-right&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cssnr/auto-auth&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=cssnr/auto-auth&type=date&legend=bottom-right" />
 </picture>
</a>
