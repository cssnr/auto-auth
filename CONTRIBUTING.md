# Contributing

- [Developing](#developing)
- [Building](#building)
- [WXT](#wxt)

For workflow instructions, see the main [CSSNR CONTRIBUTING.md](https://github.com/cssnr/.github/blob/master/.github/CONTRIBUTING.md).

<details><summary>To set local master as legacy</summary>

It is easier to delete and re-clone the repository;
however, if you want to avoid doing that:

```shell
git branch -m master legacy
git fetch origin
git branch -u origin/legacy legacy
git remote set-head origin -a
git remote prune origin
git checkout master
```

</details>

## Developing

To get started clone the project and install the dependencies.

```shell
npm install
```

Note: WXT launches a browser by default when you run `dev`.
See [Browser Opening](#browser-opening) modify the browser or disable this behavior.

### Chrome

```shell
npm run dev
```

**To Load Manually,** open Chrome and navigate to `chrome://extensions/`, enable "Developer mode",
and load the unpacked extension from the `.output` directory.

### Firefox

```shell
npm run dev:ff
```

**To Load Manually,** open Firefox and navigate to `about:debugging#/runtime/this-firefox`, then click "Load Temporary Add-on..."
and load the unpacked extension from the `.output` directory.

### Android

This requires the [Android Debug Bridge (adb)](https://developer.android.com/tools/adb).

In another terminal (or without the watcher run `npm build:ff`).

```shell
npm run watch:ff
```

Enable USB or Wireless Debugging, connect, and get your device `name`.

```shell
adb devices
```

Then run using your device `name`.

```shell
npm run android -- name
```

## Building

### Package All

This type checks the project, builds and zips to the `.output` directory.

```shell
npm run package
```

### Chrome

To build the `.output` directory.

```shell
npm run build
```

To build and create an archive in the `.output` directory.

```shell
npm run zip:chrome
```

### Firefox

To build the `.output` directory.

```shell
npm build:ff
```

To build and create an archive in the `.output` directory.

```shell
npm run zip:ff
```

## WXT

This project uses the WXT framework.

- <https://wxt.dev/>

### Browser Opening

To customize the config for development add a `web-ext.config.ts` to the project root.

The binaries allow you to pick which browser opens. To disable auto-opening set `disabled: true`.

```typescript
// web-ext.config.ts
import { defineWebExtConfig } from 'wxt'

export default defineWebExtConfig({
  binaries: {
    firefox: 'C:/Program Files/Firefox Developer Edition/firefox.exe',
    chrome: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  },
  // disabled: true,
})
```

### Loading Unpacked

Additional notes on loading temporary/unpacked extensions.

- [Mozilla Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
- [Google Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)
- [Microsoft Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading#locally-installing-and-running-an-extension)
