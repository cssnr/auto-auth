# Usage

There are many ways to use the extension depending on your preference.

[[toc]]

## Auth Page

When you visit a site that requires HTTP Basic Authentication and no credentials are saved, the extension shows a custom login page instead of the native browser popup.

Enter your username and password, then click **Login**. If **Save Login** is enabled, credentials are saved for future visits.

- **No Username** — Toggle this for password-only authentication.
- **Save Login** — When off, credentials are session-only and lost when the browser closes.
- **Ignore Host** — Permanently skips the auth page for this host, letting the native browser prompt appear.

To take it for a test drive, install the addon and visit: https://authenticationtest.com/HTTPAuth/
Then enter the username `user` and password `pass`.

## Toolbar Popup

The popup is accessible from your browser's extension **toolbar icon**. You may need to pin the icon to the toolbar depending on your browser.

The popup shows the current tab's hostname and credential status:

- **Green border** — Credentials are saved for this site.
- **Yellow border** — The host is ignored.
- **Red border** — The tab URL is inaccessible.
- **Neutral border** — No saved credentials.

From the popup you can:

- Edit credentials for the current host.
- Delete credentials for the current host.
- Toggle extension options.
- Open the full options page.

## Side Panel

The side panel provides full credential management without leaving your current tab.

- View and manage all saved credentials in a table.
- Add new host credentials.
- Import credentials from text.
- Toggle extension options.
- Open the extension panel (popout window).

The side panel can be toggled via [keyboard shortcut](#keyboard-shortcuts) or the [context menu](#context-menu).

## Extension Panel

The extension panel is a pop-out window with the same features as the side panel. It opens as a separate browser window that stays open as you browse.

- Full credential management.
- Import/export credentials.
- Options form.
- Remembers its size between sessions.

## Credentials Table

The credentials table shows all saved host entries with columns for hostname, username, and password.

**Inline Editing** — Click any cell (hostname, username, or password) to edit it in place. Press Enter to save, Escape to cancel.

**Column Visibility** — Show or hide the username and password columns. Hidden values display as `******`.

**Add Host** — Click the add button to open the modal for adding new credentials.

**Delete** — Click the trash icon on any row. If confirmation is enabled, a modal will appear first.

## Context Menu

Right-click on a page to access extension actions:

| Item | Description |
| --- | --- |
| **Open Popup** | Opens the extension popup panel. |
| **Open Side Panel** | Opens the side panel. |
| **Open Extension Panel** | Opens the popout window. |
| **Open Options** | Opens the options page. |

The context menu can be enabled/disabled from the [options page](options.md#context-menu).

## Keyboard Shortcuts

| Description | Shortcut |
| --- | --- |
| Open Popup | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> |
| Open Side Panel | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> |
| Open Extension Panel | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> |
| Open Options | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> |

Shortcuts can be customized through your browser's built-in extension shortcut manager.

- Google Chrome: `chrome://extensions/shortcuts`
- Mozilla Firefox: https://mzl.la/3Qwp5QQ

## Toolbar Icon

The toolbar icon color indicates extension status:

| Color | Meaning |
| --- | --- |
| **Green** | Host permissions granted, extension active. |
| **Yellow** | Extension is temporarily disabled. |
| **Red** | Host permissions not granted. |

The badge on the icon shows per-tab status:

| Badge | Meaning |
| --- | --- |
| **On** (green) | Credentials are saved for this site. |
| **Off** (yellow) | The host is ignored. |
| *(empty)* | No credentials for this site. |

## Import / Export

From the [options page](options.md) or side panel:

- **Export All** — Downloads all credentials as a JSON file (`auto-auth-secrets.txt`).
- **Import File** — Import a JSON file with credentials.
- **Import Text** — Paste JSON text directly into a textarea to import.

Supported import formats: Auto Auth, AutoAuth, Basic Authentication, MultiPass. See the [migration page](migration.md) for details.

<div class="info custom-block" style="padding-top: 8px; margin-top: 64px;">

:bulb: If you need help using the extension, [support](support.md) is available...

</div>
