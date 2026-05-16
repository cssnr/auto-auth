export type HostsRecord = Record<string, string>

export class Hosts {
  static readonly keys: string[] = [...'abcdefghijklmnopqrstuvwxyz0123456789']

  static async all(): Promise<HostsRecord> {
    const sync = await chrome.storage.sync.get<HostsRecord>(Hosts.keys)
    return Object.assign({}, ...Object.values(sync)) as HostsRecord
  }

  static async get(host: string): Promise<string | undefined> {
    const sync = await Hosts.#getSync(host)
    return sync[host]
  }

  static async set(host: string, creds: string): Promise<void> {
    const sync = await Hosts.#getSync(host)
    sync[host] = creds
    await chrome.storage.sync.set({ [host[0]]: sync })
  }

  static async delete(host: string): Promise<void> {
    const sync = await Hosts.#getSync(host)
    delete sync[host]
    await chrome.storage.sync.set({ [host[0]]: sync })
  }

  static async edit(old: string, host: string, creds: string): Promise<void> {
    if (old !== host) {
      await this.delete(old)
    }
    await this.set(host, creds)
  }

  static async update(hosts: HostsRecord): Promise<void> {
    const sync = await chrome.storage.sync.get<Record<string, HostsRecord>>(Hosts.keys)
    for (const [key, value] of Object.entries(hosts)) {
      if (!(key[0] in sync)) {
        sync[key[0]] = {}
      }
      sync[key[0]][key] = value
    }
    await chrome.storage.sync.set(sync)
  }

  static async #getSync(host: string): Promise<HostsRecord> {
    const sync = await chrome.storage.sync.get<Record<string, HostsRecord>>(host[0])
    return sync[host[0]] ?? {}
  }
}

// Above Code is Original - New Code Below

// NOTE: Moved from components/HostModal.vue and exported
export function validateHostname(hostname: string): string | undefined {
  // console.log('validateHostname:', hostname)
  try {
    let value = hostname
    // console.log('value1:', value)
    if (!value.includes('://')) value = `https://${value}`
    // console.log('value2:', value)
    const url = new URL(value)
    // console.log(`url.hostname: "${url.hostname}"`, url)
    return url.hostname
  } catch {
    // invalid hostname
  }
}
