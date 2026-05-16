// NOTE: Implement import.meta.env.FIREFOX instead of isFirefox
export const isFirefox = !!import.meta.env.FIREFOX
// export const isFirefox =
//   typeof browser !== 'undefined' && typeof browser?.runtime?.getBrowserInfo === 'function'

// export const isMobile = !!chrome.contextMenus
export const isMobile = typeof chrome.contextMenus !== 'object'
