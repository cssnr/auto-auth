---
prev:
  text: 'Migration'
  link: '/migration'
next:
  text: 'Support'
  link: '/support'
---

# Security

[[toc]]

## Credential Storage

Since there is no API to manage or store credentials securely, usernames and passwords are stored in the web extension's [sync storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync). This will sync your credentials to all browsers you are logged into if sync is enabled for addons. Therefore, any computers you use a synced browser on will write the credentials to the file system in plain text.

## What This Means

- Credentials are stored locally in your browser's extension storage.
- If browser sync is enabled, credentials sync across all devices logged into the same browser account.
- Synced data may be written to disk in plain text on each synced device.
- The developer never receives, processes, or has access to any data or credentials.

## Potential Mitigations

If there is enough popularity/requests for these features, there are a couple options to mitigate the risks:

- Option to switch between sync and local storage to limit credentials to a single computer.
- Option to encrypt credentials using a password that must be entered once every session.

For more details see the [PRIVACY.md](https://github.com/cssnr/auto-auth/blob/master/PRIVACY.md).

<div class="info custom-block" style="padding-top: 8px; margin-top: 64px;">

:bulb: If you need help using the extension, [support](support.md) is available...

</div>
