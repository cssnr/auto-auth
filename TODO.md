# TODO

## General

Items identified while refactoring the codebase that have not yet been resolved.

- Add ability to ignore a host from options
- Duplication in [popup/App.vue](src/entrypoints/popup/App.vue)/[HostsTable.vue](src/components/HostsTable.vue)
- Refactor how width is set in [popup/App.vue](src/entrypoints/popup/App.vue)
- Refactor importCredentials in [creds.ts](src/utils/creds.ts) to reduce complexity
- Refactor onMounted in [auth/App.vue](src/entrypoints/auth/App.vue) to catch and handle errors
- Refactor generateIcons to replace auto-icons in [wxt.config.ts](wxt.config.ts)
- Refactor useOptions to use provide from APP and inject from component
- Look into refactoring HostModal to be "provided" to the components
- Cleanup functions in [utils/index.ts](src/utils/index.ts)

## Default Ports

Bare-entered keys with a scheme-default port (`example.com:80`, `example.com:443`)
are stored literally, but the request side strips the default port for the request's
scheme (`http://...:80` and `https://...:443` both become portless in `url.host`).
A portless entry (`example.com`) matches any port and scheme via the fallback in
[hosts.ts](src/utils/hosts.ts), but a literal `:80`/`:443` entry only ever matches
the opposite-scheme request (e.g. `example.com:80` only matches `https://example.com:80/`),
so it is effectively inert. The scheme of a bare host is unknown at entry time,
so it cannot be stripped there.

Consider warning on or stripping explicit scheme-default ports (`:80`, `:443`)
in [validateHostname](src/utils/hosts.ts), or normalizing full-URL entries only
(which already strip the default port via `url.host`)

## Logging

Logging items not cleaned up during refactoring.

- Check all `TODO: Logging` comments in code
- Cleanup Logging in [App.vue](src/entrypoints/auth/App.vue)
- Cleanup Logging in [auth.ts](src/entrypoints/background/auth.ts)
- Cleanup Logging in [creds.ts](src/utils/creds.ts)
- Cleanup Logging in [content/index.ts](src/entrypoints/content/index.ts)
