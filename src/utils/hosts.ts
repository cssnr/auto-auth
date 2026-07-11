export type HostsRecord = Record<string, string>

export function matchesWildcard(host: string, pattern: string): boolean {
  const hostColon = host.indexOf(':')
  const hostName = hostColon === -1 ? host : host.slice(0, hostColon)
  const hostPort = hostColon === -1 ? undefined : host.slice(hostColon + 1)

  const patternColon = pattern.indexOf(':')
  const patternName = patternColon === -1 ? pattern : pattern.slice(0, patternColon)
  const patternPort = patternColon === -1 ? undefined : pattern.slice(patternColon + 1)

  if (patternPort !== undefined && patternPort !== '*') {
    if (patternPort !== hostPort) return false
  }

  const hostParts = hostName.split('.')
  const patternParts = patternName.split('.')
  if (patternParts.length !== hostParts.length) return false

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === '*') {
      if (!hostParts[i] || hostParts[i].length === 0) return false
    } else if (patternParts[i] !== hostParts[i]) {
      return false
    }
  }

  return true
}

export function countWildcards(pattern: string): number {
  return (pattern.match(/\*/g) || []).length
}

export function findBestWildcardMatch(
  host: string,
  patterns: Record<string, string> | undefined,
): string | undefined {
  if (!patterns) return undefined
  let bestMatch: string | undefined
  let bestSpecificity = Infinity
  for (const [pattern, creds] of Object.entries(patterns)) {
    if (!pattern.includes('*')) continue
    if (matchesWildcard(host, pattern)) {
      const specificity = countWildcards(pattern)
      if (specificity < bestSpecificity) {
        bestSpecificity = specificity
        bestMatch = creds
      }
    }
  }
  return bestMatch
}

export class Hosts {
  static readonly keys: string[] = [...'*abcdefghijklmnopqrstuvwxyz0123456789']

  static async all(): Promise<HostsRecord> {
    const sync = await chrome.storage.sync.get<HostsRecord>(Hosts.keys)
    return Object.assign({}, ...Object.values(sync)) as HostsRecord
  }

  static async get(host: string): Promise<string | undefined> {
    const result = await Hosts.#lookup(host)
    return result?.creds
  }

  static async matchKey(host: string): Promise<string | undefined> {
    const result = await Hosts.#lookup(host)
    return result?.key
  }

  static async #lookup(
    host: string,
  ): Promise<{ key: string; creds: string } | undefined> {
    const sync = await Hosts.#getSync(host)
    const exact = sync[host]
    if (exact) return { key: host, creds: exact }

    const all = await Hosts.all()
    let bestKey: string | undefined
    let bestCreds: string | undefined
    let bestSpecificity = Infinity

    for (const [pattern, creds] of Object.entries(all)) {
      if (!pattern.includes('*')) continue
      if (matchesWildcard(host, pattern)) {
        const specificity = countWildcards(pattern)
        if (specificity < bestSpecificity) {
          bestSpecificity = specificity
          bestKey = pattern
          bestCreds = creds
        }
      }
    }

    return bestKey ? { key: bestKey, creds: bestCreds! } : undefined
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

// NOTE: Moved from components/HostModal.vue and exported
export function validateHostname(hostname: string): string | undefined {
  const value = hostname.toLowerCase().trim()

  if (value.includes('*')) {
    const colonIndex = value.indexOf(':')
    const hostPart = colonIndex === -1 ? value : value.slice(0, colonIndex)
    const portPart = colonIndex === -1 ? undefined : value.slice(colonIndex + 1)

    if (portPart !== undefined && portPart !== '*' && !/^\d+$/.test(portPart))
      return undefined

    const segments = hostPart.split('.')
    if (segments.length === 0 || segments.some((s) => s === '')) return undefined
    for (const segment of segments) {
      if (segment === '*') continue
      if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(segment)) return undefined
    }

    return portPart !== undefined ? `${hostPart}:${portPart}` : hostPart
  }

  try {
    let urlValue = value
    if (!urlValue.includes('://')) urlValue = `https://${urlValue}`
    const url = new URL(urlValue)
    return url.hostname
  } catch {
    // invalid hostname
  }
}
