# New Issue - Agent Guide

## UI

All UI elements can be accessed via a Keyboard Shortcut (if configured) and the Right-Click context menu (if enabled).

The extension options allow setting a custom background Picture or Video URL that shows on the Options and Auth pages.

### Auth Page (webRequest.onAuthRequired)

The Auth page is shown when auth is required, allowing the user to enter their username and password.

The page allows saving the credentials, entering them without saving, or ignoring the host permanently.

Includes an Offscreen Options page accessible from an icon in the bottom-left corner of the screen.

### Options Page

Shows keyboard shortcuts, extension options, import/export, and credentials table.
Has links to the home page, support page, and a button to copy support information.

### Popup

Shows extension options; allows viewing/editing credentials for the active tab, if any exist.

### Side Panel

Shows extension options, import/export, and credentials table.

### Popout (Extension Panel)

Shows extension options, import/export, and credentials table.

## Components

- **Context Menu**: openPopup, openSidePanel, openExtPanel, openOptions
- **Keyboard Shortcuts**: openPopup, openSidePanel, openExtPanel, openOptions

### Credentials Table

Can be configured to show/hide the username and password columns, show/hide the username and password values,
enable click-to-edit (clicking a field makes it editable), or show large table rows.

The hosts column is always visible. Each row has a delete button on the left and an edit button on the right.

Hosts can also be exported or imported from file or text. Import supports these other extensions:

- [krtek4/MultiPass](https://github.com/krtek4/MultiPass)
- [steffanschlein/AutoAuth](https://github.com/steffanschlein/AutoAuth)
- [Basic Authentication](https://chromewebstore.google.com/detail/nanfgbiblbcagfodkfeinbbhijihckml)

Instructions are on the GitHub README.

## Additional Notes

- Permissions: `contextMenus`, `storage`, `webRequest`, `webRequestAuthProvider`
- Host permissions: `*://*/*`

## Changes/New Features in v1.0.0

- The Credentials Table and Options are now available in the Side Panel and Extension Panel UI.
- The Credentials Table supports inline editing by clicking on a cell (can be disabled in Options).
- The Credentials Table allows showing/hiding the password and username columns and their values.
- The Credentials Table row size can be set to Large.
- New migration added from MultiPass.
