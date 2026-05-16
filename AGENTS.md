# Agent Guide

Auto Auth is a Web Extension to allow automatic HTTP Basic Authentication.

- Chrome + Firefox + Firefox Android all using MV3
- WXT Framework with TypeScript + Vue3
- Bootstrap 5.3 and FontAwesome

## Application Structure

- The `@/` import resolves to `src/`
- Manifest generated from `wxt.config.ts`
- Entrypoint specific options in `src/entrypoints/<name>/index.html`
- Content script specific options in `src/entrypoints/content(.<name>)/index.ts`
- Locales are in `src/locales` and use `@wxt-dev/i18n/module` in `yaml` format

## Style & Conventions

- Prettier: no semi, single quotes, printWidth 90 (120 for `.vue`).
- Custom logger `debug()` from `utils/logger.ts` use for all log output.
