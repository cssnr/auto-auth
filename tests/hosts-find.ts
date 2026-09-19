import { Hosts } from '@/utils/hosts.ts'

const storage = new Map<string, any>()

;(globalThis as any).chrome = {
  storage: {
    sync: {
      async get(keys: string | string[]): Promise<Record<string, any>> {
        if (Array.isArray(keys)) {
          const out: Record<string, any> = {}
          for (const key of keys) out[key] = storage.get(key) ?? {}
          return out
        }
        return { [keys]: storage.get(keys) }
      },
      async set(items: Record<string, any>) {
        for (const [key, value] of Object.entries(items)) storage.set(key, value)
      },
    },
  },
}

async function seed(record: Record<string, string>) {
  storage.clear()
  const buckets: Record<string, Record<string, string>> = {}
  for (const [key, value] of Object.entries(record)) {
    const bucket = key[0]!
    ;(buckets[bucket] ??= {})[key] = value
  }
  for (const [key, value] of Object.entries(buckets)) storage.set(key, value)
}

const check = async (name: string, actual: unknown, expected: unknown) => {
  const result = await actual
  const pass = JSON.stringify(result) === JSON.stringify(expected)
  if (!pass) failed++
  const status = pass ? '' : `⛔ FAIL (got ${JSON.stringify(result)})`
  console.log(`  ${name.padEnd(58)} ${JSON.stringify(expected)} ${status}`)
}

let failed = 0

console.log('Hosts.find port agreement:')

await seed({ 'example.com:8080': 'u2:p2', 'example.com': 'u1:p1' })
await check('ported exact beats portless', Hosts.find('example.com:8080'), {
  key: 'example.com:8080',
  creds: 'u2:p2',
})

await seed({ 'example.com': 'u1:p1' })
await check('portless key matches ported request', Hosts.find('example.com:8080'), {
  key: 'example.com',
  creds: 'u1:p1',
})
await check('portless key matches portless request', Hosts.find('example.com'), {
  key: 'example.com',
  creds: 'u1:p1',
})

await seed({ 'example.com:8080': 'u2:p2' })
await check(
  'ported key does not match portless request',
  Hosts.find('example.com'),
  undefined,
)

await seed({ '*.example.com': 'u1:p1', '*.example.com:8080': 'u2:p2' })
await check('ported wildcard beats portless wildcard', Hosts.find('a.example.com:8080'), {
  key: '*.example.com:8080',
  creds: 'u2:p2',
})

await seed({ 'example.com': 'u1:p1', '*.example.com:8080': 'u2:p2' })
await check('portless exact beats ported wildcard', Hosts.find('example.com:8080'), {
  key: 'example.com',
  creds: 'u1:p1',
})

await seed({ '[::1]': 'u6:p6' })
await check('portless ipv6 key matches ported request', Hosts.find('[::1]:8080'), {
  key: '[::1]',
  creds: 'u6:p6',
})

await seed({})
await check('no entries', Hosts.find('example.com:8080'), undefined)

if (failed > 0) {
  console.error(`\n${failed} FAILURES`)
  process.exit(1)
}
console.log('\nALL PASS')
