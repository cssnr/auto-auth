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

    // NOTE: Agree with wildcards: an entry without a port matches any port, so
    //   a portless key falls back to a request with a port
    const [hostName, hostPort] = parseHostPort(host)
    if (hostPort !== undefined) {
      const portless = sync[hostName]
      if (portless) return { key: hostName, creds: portless }
    }

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
  const value = extractHost(hostname.toLowerCase().trim())
  if (value === undefined) return undefined
  const [hostPart, portPart] = parseHostPort(value)

  if (portPart !== undefined && portPart !== '*' && !/^\d+$/.test(portPart)) {
    return undefined
  }

  // NOTE: Accept bracketed IPv6 addresses; canonicalize the literal via
  //   `url.hostname` (which never includes the port) and keep the port
  //   verbatim, so keys round-trip with `url.host` — except for scheme-default
  //   ports (http :80, https :443), which the URL parser strips from
  //   `url.host`, so those keys only match the non-default scheme
  if (hostPart.startsWith('[')) {
    try {
      const hostname = new URL(`https://${hostPart}`).hostname
      return portPart !== undefined ? `${hostname}:${portPart}` : hostname
    } catch {
      return undefined
    }
  }

  if (!validLabels(hostPart)) return undefined
  return portPart !== undefined ? `${hostPart}:${portPart}` : hostPart
}

// NOTE: Accept full URLs (e.g. `https://cssnr.com/path`) and normalize to `host[:port]`
function extractHost(value: string): string | undefined {
  if (!value.includes('/')) return value
  if (!value.includes('://')) value = `https://${value}`
  try {
    const url = new URL(value)
    return url.host || url.hostname
  } catch {
    return undefined
  }
}

function validLabels(host: string): boolean {
  const segments = host.split('.')
  if (segments.length === 0 || segments.includes('')) return false
  for (const segment of segments) {
    if (segment === '*' || segment === '**') continue
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(segment)) return false
  }
  return true
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

// NOTE: Only used by the (commented out) session wildcard fallback, which is inert
// export function findBestWildcardMatch(
//   host: string,
//   patterns: Record<string, string> | undefined,
// ): string | undefined {
//   return findBestWildcard(host, patterns)?.creds
// }

export function findBestWildcard(
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

// NOTE: Exact labels are most specific, then `*`, then `**`. An explicit
//   numeric port only breaks label ties (i.e. `*.example.com:8080` beats
//   `*.example.com` for a `:8080` host), so the port tier (max 2) is scaled
//   below a single label difference (4).
function wildcardSpecificity(pattern: string): number {
  const [host, port] = parseHostPort(pattern)
  const labelScore = host.split('.').reduce((score, segment) => {
    if (segment === '**') return score
    if (segment === '*') return score + 1
    return score + 2
  }, 0)
  // NOTE: `*` port and no port match the same set of hosts, so only an
  //   explicit numeric port adds specificity
  const portScore = port !== undefined && port !== '*' ? 2 : 0
  return labelScore * 4 + portScore
}
