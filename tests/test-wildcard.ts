import { matchesWildcard } from '@/utils/hosts.ts'

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
]

for (const [host, pattern, expected] of tests) {
  const result = matchesWildcard(host, pattern)
  const status = result === expected ? '' : '⛔ FAIL ⛔'
  console.log(`${pattern.padEnd(19)} ${expected ? '✅' : '❌'}  ${host} ${status}`)
}
