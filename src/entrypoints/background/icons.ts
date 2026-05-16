import { debug } from '@/utils/logger.ts'
import { type Options, getOptions } from '@/utils/options.ts'

const getIcons = (color = '') => {
  // NOTE: Should be reusable for wxt.config.ts manifest generation...
  const name = color === 'green' ? '' : color
  return {
    16: `/icons/${name}16.png`,
    24: `/icons/${name}24.png`,
    32: `/icons/${name}32.png`,
    48: `/icons/${name}48.png`,
    96: `/icons/${name}96.png`,
    128: `/icons/${name}128.png`,
  }
}

export async function updateIcon(options?: Options) {
  if (!options) options = await getOptions()
  // debug('options.tempDisabled:', options.tempDisabled)
  const manifest = chrome.runtime.getManifest()
  // NOTE: origins defined: background/index.ts, components/PermsCheck.vue
  const hasPerms = await chrome.permissions.contains({
    origins: manifest.host_permissions,
  })
  // debug('hasPerms:', hasPerms)
  let color = 'green'
  if (!hasPerms) {
    color = 'red'
  } else if (options.tempDisabled) {
    color = 'yellow'
  }
  debug('updateIcon - color:', color)
  await chrome.action.setIcon({ path: getIcons(color) })
}
