export type HostsRecord = Record<string, string>

export class Hosts {
  static readonly keys: string[] = [...'*abcdefghijklmnopqrstuvwxyz0123456789']

  static async all(): Promise<HostsRecord> {
    const sync = await chrome.storage.sync.get<HostsRecord>(Hosts.keys)
    return Object.assign({}, ...Object.values(sync)) as HostsRecord
  }

  static async has(host: string): Promise<boolean> {
    const sync = await Hosts.#getSync(host)
    return host in sync
  }

  static async get(host: string): Promise<string | undefined> {
    const result = await Hosts.find(host)
    return result?.creds
  }

  static async find(host: string): Promise<{ key: string; creds: string } | undefined> {
    const sync = await Hosts.#getSync(host)
    const exact = sync[host]
    if (exact) return { key: host, creds: exact }

    return findBestWildcard(host, await Hosts.all())
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
    await this.set(host, creds)
    if (old !== host) {
      await this.delete(old)
    }
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

  const [hostPart, portPart] = parseHostPort(value)

  if (portPart !== undefined && portPart !== '*' && !/^\d+$/.test(portPart)) {
    return undefined
  }

  const segments = hostPart.split('.')
  if (segments.length === 0 || segments.includes('')) return undefined
  for (const segment of segments) {
    if (segment === '*') continue
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(segment)) return undefined
  }

  return portPart !== undefined ? `${hostPart}:${portPart}` : hostPart
}

export function matchesWildcard(host: string, pattern: string): boolean {
  const [hostName, hostPort] = parseHostPort(host)
  const [patternName, patternPort] = parseHostPort(pattern)

  if (patternPort !== undefined && patternPort !== '*' && patternPort !== hostPort) {
    return false
  }

  const hostParts = hostName.split('.')
  const patternParts = patternName.split('.')
  if (patternParts.length !== hostParts.length) return false

  return patternParts.every((part, i) =>
    part === '*' ? (hostParts[i]?.length ?? 0) > 0 : part === hostParts[i],
  )
}

export function findBestWildcardMatch(
  host: string,
  patterns: Record<string, string> | undefined,
): string | undefined {
  return findBestWildcard(host, patterns)?.creds
}

function findBestWildcard(
  host: string,
  patterns: Record<string, string> | undefined,
): { key: string; creds: string } | undefined {
  if (!patterns) return undefined
  let bestKey: string | undefined
  let bestCreds: string | undefined
  let bestSpecificity = Infinity
  for (const [pattern, creds] of Object.entries(patterns)) {
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

function parseHostPort(value: string): [string, string | undefined] {
  const colon = value.indexOf(':')
  return colon === -1
    ? [value, undefined]
    : [value.slice(0, colon), value.slice(colon + 1)]
}

function countWildcards(pattern: string): number {
  return (pattern.match(/\*/g) || []).length
}
