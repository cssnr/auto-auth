# Agent Guide

Auto Auth is a Web Extension to allow automatic HTTP Basic Authentication.

- Chrome + Firefox + Firefox Android all using MV3
- WXT (https://wxt.dev/) Framework https://github.com/wxt-dev/wxt
- TypeScript 6 with Vue 3.5
- Bootstrap 5.3 and FontAwesome

## Project Structure

IMPORTANT: Both `useOptions()` and `getOptions()` ALWAYS have DEFAULT values set!

### Files

- `wxt.config.ts` - WXT Config and Extension Manifest
- `src/app.config.ts` - WXT Application Runtime Configuration
- `src/entrypoints/background/index.ts` Background Service Worker
- `src/entrypoints/content/index.ts` Content Script Entrypoint
- `src/assets/css/styles.scss` - Main SCSS styles
- `src/main.ts` - Imported by all `src/entrypoints/*/main.ts` files

### Directories

- `src` - Source directory for the web extension, WXT Framework.
- `src/entrypoints/**` - WXT entrypoints
- `src/locales` - YAML locale files using `@wxt-dev/i18n`
- `src/components` - Vue components
- `src/directives` - Vue directives

## Commands

ALWAYS use the `npm run *` command NEVER pipe output into arbitrary truncation commands.

| Command            | What it does                      |
| ------------------ | --------------------------------- |
| `npm run build`    | `wxt build` to `.output`          |
| `npm run build:ff` | build Firefox only (faster)       |
| `npm run clean`    | `rm -rf .output`                  |
| `npm run lint`     | `npx eslint src` ESLint           |
| `npm run tsc`      | `vue-tsc --noEmit` TS Check       |
| `npm run test`     | `tsx` run tests in `tests/`       |
| `npm run prepare`  | `wxt prepare` Generate i18n Types |
| `npm run prettier` | ALWAYS RUN AFTER EDITING FILES    |

## Follow Existing Patterns

Before adding or modifying any feature, search the codebase for the closest existing implementation and follow its full integration chain.
Do not stop after writing the core logic — trace every file that touches the feature (imports, registration, configuration, UI binding) and ensure each is accounted for.
