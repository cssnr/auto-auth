---
outline: [2, 3]
---

# Options

The options let you control how the extension functions, looks and feels.

- [Extension Options](#extension-options)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Table Options](#table-options)
- [Background Options](#background-options)

## Extension Options

General extension behaviour settings.

#### Temporarily Disable Extension

Disables the extension temporarily. The toolbar icon turns yellow and all authentication requests pass through to the native browser prompt. Useful for debugging or testing. Re-enable when done.

#### Ignore Proxy Authentication

When enabled, HTTP 407 Proxy Auth Required responses are not intercepted by the extension. The native browser proxy authentication prompt will appear instead.

#### Save Authentication by Default

Pre-enables the **Save Login** switch on the auth page. When on, credentials are saved permanently by default. When off, credentials are session-only unless the user manually toggles the switch.

#### Show Confirmation on Delete

Display a confirmation prompt before deleting saved credentials. Adds a safety step to prevent accidental deletions.

#### Show Right-Click Context Menu

Adds extension actions (Open Popup, Open Side Panel, Open Extension Panel, Open Options) to the browser's right-click context menu. Disable this to remove the menu items from page context entirely. They will still appear when right-clicking the toolbar icon.

#### Show Release Notes on Update

Automatically opens the Release Notes page when the extension is updated to a new version. Keep informed of new features, bug fixes, and changes.

#### Full Width Options Page

Removes the max-width constraint on the options page, allowing it to fill the full browser width.

## Keyboard Shortcuts

Manage the keyboard shortcuts used to open extension panels directly from the browser.

Shortcuts can be customized through your browser's built-in extension shortcut manager. Click **Manage Keyboard Shortcuts** to open it.

| Description | Shortcut |
| --- | --- |
| Open Popup | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> |
| Open Side Panel | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> |
| Open Extension Panel | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd> |
| Open Options | <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> |

Note: Shortcuts marked _Not Set_ can be assigned in your browser's extension shortcut settings. In Chrome, visit `chrome://extensions/shortcuts`. In Firefox, visit `about:addons` and click the gear icon.

## Table Options

Control how the saved credentials table looks and behaves.

#### Click-to-Edit

Enable inline editing on table cells. Click any hostname, username, or password cell to edit it in place. Press Enter to save, Escape to cancel.

#### Show Username Column

Show or hide the username column in the credentials table.

#### Show Username Values

When the username column is visible, show or hide the actual username values. When off, usernames display as `******`.

#### Show Password Column

Show or hide the password column in the credentials table.

#### Show Password Values

When the password column is visible, show or hide the actual password values. When off, passwords display as `******`.

#### Large Table Rows

Use larger row spacing in the credentials table. Disable for a more compact view.

## Background Options

Set a custom background image or video on the auth page and options page.

- **None** — No background.
- **Picture** — Set an image URL as the background.
- **Video** — Set a video URL as the background.

<div class="info custom-block" style="padding-top: 8px; margin-top: 64px;">

:bulb: If you need help using the extension, [support](support.md) is available...

</div>
