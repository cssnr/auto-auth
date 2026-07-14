---
prev:
  text: 'Options'
  link: '/options'
next:
  text: 'Security'
  link: '/security'
---

# Migration

Migration guides from other extensions and manual import instructions.

[[toc]]

## MultiPass

Migration from [krtek4/MultiPass](https://github.com/krtek4/MultiPass) (Firefox/Chrome).

1. Open the MultiPass Options
2. Click: `Download credentials as JSON file.`
3. Open the Auto Auth Options and click `Import File`
4. Select the file exported in Step #2

## AutoAuth

Migration from [steffanschlein/AutoAuth](https://github.com/steffanschlein/AutoAuth) (Firefox).

1. Open Addons Management (about:addons) `Ctrl+Shift+A`
2. Find AutoAuth, click the 3 dots, then click Options
3. Open Developer Tools `Ctrl+Shift+I` and go to Console tab
4. Enter the following code: `await browser.storage.local.get()`
5. Right-click on the resulting output and choose `Copy Object`
6. Go to the Options Page (for this extension) and click `Import Text`
7. Paste the copied text into the textarea and click `Import`

## Basic Authentication

Migration from [Basic Authentication](https://chromewebstore.google.com/detail/nanfgbiblbcagfodkfeinbbhijihckml) (Chrome).

1. Go To this URL: `chrome-extension://nanfgbiblbcagfodkfeinbbhijihckml/options.html`
2. Open Developer Tools `Ctrl+Shift+I` and go to Console tab
3. Enter the following code: `await chrome.storage.local.get()`
4. Right-click on the resulting output and choose `Copy Object`
5. Go to the Options Page (for this extension) and click `Import Text`
6. Paste the copied text into the textarea and click `Import`

> **Note:** Basic Authentication uses url match patterns vs hostnames. This import will attempt to parse the match pattern to a hostname; however, if the full hostname is not provided, may not import correctly. You can always edit the credentials manually or save new ones on the next login.

## Other or Manual

To manually migrate from other data exports you need to convert the data into a compatible JSON format. You can do this yourself, or get AI to convert the data format for you. Convert the data to this JSON format:

```json
{
  "example.com": "username:password",
  "ignored.example.com": "ignored"
}
```

To import the data, visit the extension's Options Page, click `Import Text` and paste the JSON text.

You can also [request a migration](https://github.com/cssnr/auto-auth/issues/new?template=1-feature.yaml) be added for your extension. If it is popular enough, it might get added.

<div class="info custom-block" style="padding-top: 8px; margin-top: 64px;">

:bulb: If you need help using the extension, [support](support.md) is available...

</div>
