import { defineConfig } from 'vitepress'
import instructions from 'vitepress-chat/instructions'

const settings = {
  title: 'Auto Auth',
  name: 'Auto Auth Web Extension and Browser Add-on',
  description: {
    short:
      'Automatic HTTP Basic Authentication with saved credentials, import/export, and a customizable login page.',
    long: 'Modern Chrome Web Extension and Firefox Browser Add-on for Automatic Basic HTTP Authentication with many Options and Features. Replaces the native browser auth popup with a customizable login page allowing you to optionally save your credentials.',
  },
  base: '/auto-auth/', // set to empty string for no base path
  og_image: '/auto-auth/images/logo.png', // must be full path
  color: '#32fc7d',
  source_repo: 'https://github.com/cssnr/auto-auth',
  chrome_url: 'https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm',
  mozilla_url: 'https://addons.mozilla.org/addon/auto-auth',
}

// https://vitepress.dev/reference/site-config
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  // srcDir: './docs',
  base: settings.base,
  vite: {
    envDir: '..',
    plugins: [
      instructions({ filePath: 'llms.txt', exclude: ['index.md', 'updates/**'] }),
    ],
    server: {
      allowedHosts: true,
    },
  },

  title: settings.title,
  description: settings.description.short,
  head: [
    [
      'link',
      {
        rel: 'icon',
        sizes: 'any',
        href: `${settings.base}images/logo.svg`,
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '16x16 32x32 64x64 128x128',
        href: `${settings.base}favicon.ico`,
        type: 'image/x-icon',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '512x512',
        href: settings.og_image,
        type: 'image/png',
      },
    ],

    ['meta', { name: 'darkreader-lock' }],

    ['meta', { name: 'theme-color', content: settings.color }],
    ['meta', { name: 'description', content: settings.description.long }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: settings.name }],
    ['meta', { property: 'og:title', content: settings.title }],
    ['meta', { property: 'og:description', content: settings.description.short }],
    ['meta', { property: 'og:image', content: settings.og_image }],
    ['meta', { property: 'og:image:alt', content: settings.title }],

    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'twitter:site', content: settings.name }],
    ['meta', { property: 'twitter:title', content: settings.title }],
    ['meta', { property: 'twitter:description', content: settings.description.short }],
    ['meta', { property: 'twitter:image', content: settings.og_image }],
    ['meta', { property: 'twitter:image:alt', content: settings.title }],
  ],

  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: settings.title,
    logo: '/images/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Get Started',
        link: '/install',
        activeMatch: '/install',
      },
      { text: 'Support', link: '/support', activeMatch: '/support' },
      {
        text: 'Links',
        items: [
          { text: 'Chrome Web Store', link: settings.chrome_url },
          { text: 'Mozilla Add-ons', link: settings.mozilla_url },
          { text: 'GitHub Source Code', link: settings.source_repo },
          { text: 'Developer Site', link: 'https://cssnr.github.io/' },
          { text: 'Contribute', link: 'https://ko-fi.com/cssnr' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: settings.source_repo },
      { icon: 'googlechrome', link: settings.chrome_url },
      { icon: 'firefoxbrowser', link: settings.mozilla_url },
      { icon: 'discord', link: 'https://discord.gg/wXy6m2X8wY' },
      { icon: 'kofi', link: 'https://ko-fi.com/cssnr' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style="fill: none;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
        },
        link: 'https://cssnr.github.io/',
      },
    ],

    sidebar: [
      {
        text: 'Get Started',
        items: [
          { text: 'Install', link: '/install' },
          { text: 'Usage', link: '/usage' },
          { text: 'Options', link: '/options' },
          { text: 'Migration', link: '/migration' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Security', link: '/security' },
          { text: 'Support', link: '/support' },
        ],
      },
    ],

    editLink: {
      pattern: `${settings.source_repo}/blob/master/docs/:path`,
      text: 'View or Edit on GitHub',
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'medium',
      },
    },

    externalLinkIcon: true,
    outline: 'deep',
  },
})
