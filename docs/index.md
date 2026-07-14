---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Auto Auth
  text: Web Extension
  tagline: Automatic HTTP Basic Authentication with saved credentials, import/export, and a customizable login page.
  image:
    src: /images/logo.svg
    alt: Auto Auth
  actions:
    - text: Get Started
      link: /install
      theme: brand
    - text: Usage
      link: /usage
      theme: alt
    - text: Options
      link: /options
      theme: alt
    - text: Support
      link: /support
      theme: alt

features:
  - title: Install and Usage
    details: View Install and Usage Guides
    link: /install#install
  - title: Migration
    details: Migrate from Other Extensions
    link: /migration
  - title: Source Code
    details: View Source Code on GitHub
    link: https://github.com/cssnr/auto-auth
---

<BrowserIcons
style="text-align: center; margin: 40px 0 0 0;"
chrome="https://chromewebstore.google.com/detail/gpoiggobidhogpmmlakahiaaegibnogm"
firefox="https://addons.mozilla.org/addon/auto-auth"
animation="animate__rotateIn animate__slow"
size="64"
/>

<Contributors :contributors="$contributors" heading="Contributors" size="48" margin="36px 0 96px" />
