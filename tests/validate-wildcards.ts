import { matchesWildcard, findBestWildcardMatch } from '@/utils/hosts.ts'

const tests: [string, string, boolean][] = [
  ['sub.example.com', '*.example.com', true],
  ['a.b.example.com', '*.example.com', false],
  ['a.b.example.com', '*.*.com', false],
  ['example.com', '*.example.com', false],
  ['example.com:8080', 'example.com:*', true],
  ['example.com', 'example.com:*', true],
  ['example.com:8080', 'example.com:8080', true],
  ['example.com:8080', 'example.com:9090', false],
  ['sub.example.com', '*.*.com', true],
  ['example.com', 'example.com', true],
  ['example.com', '*', false],
  ['sub.example.com:8080', '*.example.com:*', true],
  ['sub.example.com:8080', '*.example.com:9090', false],
  ['staging.a', 'staging.**', true],
  ['staging.a.b', 'staging.**', true],
  ['staging.a.b.c.d', 'staging.**', true],
  ['staging', 'staging.**', false],
  ['staging.a', 'staging.**.com', false],
  ['a.example.com', '**.example.com', true],
  ['a.b.example.com', '**.example.com', true],
  ['example.com', '**.example.com', false],
  ['a.b.example.com:8080', '**.example.com:*', true],
  ['a.example.com', 'a.**.com', true],
  ['a.b.c.example.com', 'a.**.com', true],
  ['a.example.com', 'a.**.net', false],
]

const bestTests: [string, Record<string, string>, string | undefined][] = [
  ['staging.a', { 'staging.**': 'user1:pass', 'staging.*': 'user2:pass' }, 'user2:pass'],
  ['staging.a.b', { 'staging.**': 'user1:pass' }, 'user1:pass'],
  ['staging', { 'staging.**': 'user1:pass' }, undefined],
  ['example.com', { '**.com': 'user1:pass' }, 'user1:pass'],
  ['a.example.com', { '**.com': 'user1:pass' }, 'user1:pass'],
  [
    'a.example.com',
    { '*.example.com': 'user2:pass', '**.example.com': 'user1:pass' },
    'user2:pass',
  ],
]

let failed = 0

for (const [host, pattern, expected] of tests) {
  const result = matchesWildcard(host, pattern)
  const passed = result === expected
  if (!passed) failed++
  const status = passed ? '' : '⛔ FAIL ⛔'
  console.log(`${pattern.padEnd(19)} ${expected ? '✅' : '❌'}  ${host} ${status}`)
}

console.log('\nBest match:')
for (const [host, patterns, expected] of bestTests) {
  const result = findBestWildcardMatch(host, patterns)
  const passed = result === expected
  if (!passed) failed++
  const status = passed ? '' : '⛔ FAIL ⛔'
  console.log(
    `${host.padEnd(24)} ${expected ?? 'none'.padEnd(10)} ${JSON.stringify(patterns)} ${status}`,
  )
}

if (failed > 0) process.exitCode = 1
