import { i18n } from '#imports'
import { debug } from '@/utils/logger.ts'
import { showToast } from '@/composables/useToast.ts'
import { Hosts } from '@/utils/hosts.ts'

// TODO: Logging

export async function importCredentials(data: any) /* NOSONAR */ {
  // NOTE: Copied from VanillaJS...
  debug('importCredentials:', data)
  if (!data) throw new Error(i18n.t('ui.text.noCredentialsImport'))
  const format = getFormat(data)
  debug('format:', format)
  const hosts: Record<string, string> = {}
  let count = 0
  let total
  if (format === 'basicauth') {
    // Basic Authentication (nanfgbiblbcagfodkfeinbbhijihckml)
    console.log('Processing - %c Basic Authentication', 'color: Gold')
    total = data.credentialsArray.length
    for (const item of data.credentialsArray) {
      debug('item:', item)
      try {
        const key = getHost(item.url)
        hosts[key] = `${item.login}:${item.password}`
        count += 1
      } catch (e) {
        const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
        console.log(`%c${message}:`, 'color: Red')
      }
    }
  } else if (format === 'multipass') {
    // MultiPass (https://github.com/krtek4/MultiPass)
    console.log('Processing - %c MultiPass', 'color: Yellow')
    total = Object.keys(data).length
    debug('total:', total)
    for (const [key, value] of Object.entries(data)) {
      debug(`key: "${key}":`, value)
      try {
        const { url, username, password } = value as any
        const host = getHost(url)
        debug('host:', host)
        if (!username || !password) {
          console.log(`${key}: missing username or password`)
          continue
        }
        hosts[host] = `${username}:${password}`
        count += 1
      } catch (e) {
        const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
        console.log(`%c${message}:`, 'color: Red')
      }
    }
  } else if (format === 'autoauth') {
    console.log('Processing - %c AutoAuth/Native', 'color: SpringGreen')
    total = Object.keys(data).length
    for (const [key, value] of Object.entries(data)) {
      debug(`key: "${key}":`, value)
      if (!key) {
        console.log(`No hostname for value: ${value}`)
        continue
      }
      try {
        if (typeof value === 'object') {
          // AutoAuth (https://github.com/steffanschlein/AutoAuth)
          const { username, password } = value as any
          debug('username, password:', username, password)
          if (!username || !password) {
            console.log(`${key}: missing username or password`)
            continue
          }
          hosts[key] = `${username}:${password}`
          count += 1
        } else if (typeof value === 'string') {
          // Auto Auth (this extension)
          // const [username, password] = value.split(':', 1)
          const password = parseCreds(value)[1]
          if (value !== 'ignored' && !password) {
            console.log(`${key}: missing password`)
            continue
          }
          hosts[key] = value
          count += 1
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : i18n.t('import.errorUnknown')
        console.log(`${key}: %c${message}`, 'color: Red')
      }
    }
  }
  debug('hosts:', hosts)
  await Hosts.update(hosts)
  const message = `${i18n.t('ui.action.importUpdate')} ${count}/${total} ${i18n.t('ui.text.hosts')}.`
  showToast(message, count ? 'success' : 'warning') // TODO: Move showToast to the UI
}

function getFormat(data: any) {
  if (data?.credentialsArray) {
    return 'basicauth'
  }
  const firstValue = Object.values(data)[0]
  if (typeof firstValue === 'object' && firstValue !== null) {
    return 'multipass'
  } else if (typeof firstValue === 'string') {
    return 'autoauth'
  }
  throw new Error(i18n.t('ui.text.unknownFormat'))
}

function getHost(hostname: string) {
  let host = hostname.toLowerCase().trim()
  host = host.includes('://') ? host : 'https://' + host
  // debug('host:', host)
  const url = new URL(host)
  // debug('url.host:', url.host)
  if (!url.host) throw new Error(`Invalid Hostname: ${hostname}`)
  return url.host
}

export function parseCreds(creds: string): [string, string] {
  // debug('parseCreds:', creds)
  const i = creds.indexOf(':')
  if (i === -1) return [creds, '']
  const username = creds.slice(0, i)
  const password = creds.slice(i + 1)
  // debug('username:', username)
  // debug('password:', password)
  return [username, password]
}
