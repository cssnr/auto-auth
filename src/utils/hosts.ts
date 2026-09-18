export type HostsRecord = Record<string, string>

export class Hosts {
  static readonly keys: string[] = [...'[*abcdefghijklmnopqrstuvwxyz0123456789']

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
    // NOTE: noUncheckedIndexedAccess makes `host[0]` possibly undefined
    await chrome.storage.sync.set({ [host[0]!]: sync })
  }

  static async delete(host: string): Promise<void> {
    const sync = await Hosts.#getSync(host)
    delete sync[host]
    // NOTE: noUncheckedIndexedAccess makes `host[0]` possibly undefined
    await chrome.storage.sync.set({ [host[0]!]: sync })
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
      // NOTE: noUncheckedIndexedAccess makes `key[0]` possibly undefined
      const firstChar = key[0]!
      const bucket = sync[firstChar] ?? {}
      bucket[key] = value
      sync[firstChar] = bucket
    }
    await chrome.storage.sync.set(sync)
  }

  static async #getSync(host: string): Promise<HostsRecord> {
    const sync = await chrome.storage.sync.get<Record<string, HostsRecord>>(host[0])
    // NOTE: noUncheckedIndexedAccess makes `host[0]` possibly undefined
    return sync[host[0]!] ?? {}
  }
}

// NOTE: Moved from components/HostModal.vue and exported
export function validateHostname(hostname: string): string | undefined {
  let value = hostname.toLowerCase().trim()

  // NOTE: Accept full URLs (e.g. `https://cssnr.com/path`) and normalize to `host[:port]`
  if (value.includes('://') || value.includes('/')) {
    if (!value.includes('://')) value = `https://${value}`
    let url: URL
    try {
      url = new URL(value)
    } catch {
      return undefined
    }
    value = url.host || url.hostname
  }

  const [hostPart, portPart] = parseHostPort(value)

  if (portPart !== undefined && portPart !== '*' && !/^\d+$/.test(portPart)) {
    return undefined
  }

  // NOTE: Accept bracketed IPv6 addresses; canonicalize the literal via `url.hostname` (which never includes
  //   the port) and keep the port verbatim, so stored keys match `url.host` from real requests
  if (hostPart.startsWith('[')) {
    try {
      const hostname = new URL(`http://${hostPart}`).hostname
      return portPart !== undefined ? `${hostname}:${portPart}` : hostname
    } catch {
      return undefined
    }
  }

  const segments = hostPart.split('.')
  if (segments.length === 0 || segments.includes('')) return undefined
  for (const segment of segments) {
    if (segment === '*' || segment === '**') continue
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

  return matchSegments(hostParts, patternParts)
}

// NOTE: `*` matches a single label, `**` matches one or more labels
function matchSegments(hostParts: string[], patternParts: string[]): boolean {
  const match = (hostIndex: number, patternIndex: number): boolean => {
    if (patternIndex === patternParts.length) return hostIndex === hostParts.length
    const part = patternParts[patternIndex]
    if (part === '**') {
      for (let end = hostIndex + 1; end <= hostParts.length; end++) {
        if (match(end, patternIndex + 1)) return true
      }
      return false
    }
    if (hostIndex >= hostParts.length) return false
    if (part === '*')
      return (
        (hostParts[hostIndex]?.length ?? 0) > 0 && match(hostIndex + 1, patternIndex + 1)
      )
    return hostParts[hostIndex] === part && match(hostIndex + 1, patternIndex + 1)
  }
  return match(0, 0)
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
  let bestSpecificity = -1
  for (const [pattern, creds] of Object.entries(patterns)) {
    if (!pattern.includes('*')) continue
    if (matchesWildcard(host, pattern)) {
      const specificity = wildcardSpecificity(pattern)
      if (specificity > bestSpecificity) {
        bestSpecificity = specificity
        bestKey = pattern
        bestCreds = creds
      }
    }
  }
  return bestKey ? { key: bestKey, creds: bestCreds! } : undefined
}

function parseHostPort(value: string): [string, string | undefined] {
  // NOTE: IPv6 literals are bracketed and contain colons, split on the closing `]` instead
  if (value.startsWith('[')) {
    const close = value.indexOf(']')
    if (close === -1) return [value, undefined]
    const after = value.slice(close + 1)
    return after.startsWith(':')
      ? [value.slice(0, close + 1), after.slice(1)]
      : [value.slice(0, close + 1), undefined]
  }
  const colon = value.indexOf(':')
  return colon === -1
    ? [value, undefined]
    : [value.slice(0, colon), value.slice(colon + 1)]
}

// NOTE: Exact labels are most specific, then `*`, then `**`
function wildcardSpecificity(pattern: string): number {
  return pattern.split('.').reduce((score, segment) => {
    if (segment === '**') return score
    if (segment === '*') return score + 1
    return score + 2
  }, 0)
}
