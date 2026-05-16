import { debug } from '@/utils/logger.ts'

export const defaultOptions = {
  contextMenu: true,
  showUpdate: false,

  tempDisabled: false,
  ignoreProxy: false,
  defaultSave: true,
  confirmDelete: true,
  fullWidthOptions: false,

  largeTable: false,
  clickEdit: true,
  usernameShown: true,
  usernameVisible: true,
  passwordShown: false,
  passwordVisible: false,

  radioBackground: 'bgPicture' as RadioBackground,
  pictureURL: 'https://picsum.photos/1920/1080',
  videoURL: '',
}

export type Options = typeof defaultOptions & { [key: string]: unknown }

export async function getOptions(): Promise<Options> {
  let { options } = await chrome.storage.sync.get(['options'])
  options = options || {}
  return options as Options
}

export type Session = Record<string, string>

export async function getSession(): Promise<Session> {
  let { session } = await chrome.storage.session.get(['session'])
  session = session || {}
  return session as Session
}

// NOTE: This is a WIP to replace the VanillaJS saveOptions
export async function saveKeyValue(key: string, value: any) /* NOSONAR */ {
  // debug(`saveKeyValue: ${key}:`, value)
  if (!key || value === undefined) return debug('no key or value')
  const options = await getOptions()
  if (options[key] === value) return debug('value not changed')
  options[key] = value
  debug(`Set %c${key}:`, 'color: Lime', value)
  await chrome.storage.sync.set({ options })
}
