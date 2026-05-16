# TODO

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

## Logging

Logging items not cleaned up during refactoring.

- Check all `TODO: Logging` comments in code
- Cleanup Logging in [App.vue](src/entrypoints/auth/App.vue)
- Cleanup Logging in [auth.ts](src/entrypoints/background/auth.ts)
- Cleanup Logging in [creds.ts](src/utils/creds.ts)
- Cleanup Logging in [content/index.ts](src/entrypoints/content/index.ts)
