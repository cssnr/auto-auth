import { validateHostname } from '@/utils/hosts.ts'

const validTests: [string, string][] = [
  ['example.com', 'example.com'],
  ['sub.example.com', 'sub.example.com'],
  ['a.b.example.com', 'a.b.example.com'],
  ['exa-mple.com', 'exa-mple.com'],
  ['example.com:8080', 'example.com:8080'],
  ['sub.example.com:443', 'sub.example.com:443'],
  ['9gag.com', '9gag.com'],
  ['localhost', 'localhost'],
  ['Example.COM', 'example.com'],
  ['  Example.COM  ', 'example.com'],
]

const invalidTests: string[] = [
  '.example.com',
  '-example.com',
  '_example.com',
  '!example.com',
  '@example.com',
  '#example.com',
  '$example.com',
  '%example.com',
  '^example.com',
  '&example.com',
  '(example.com',
  '+example.com',
  '=example.com',
  '[example.com',
  '{example.com',
  '|example.com',
  ':example.com',
  ';example.com',
  ',example.com',
  '~example.com',
  '`example.com',
  'example.com:abc',
  'example..com',
  '.',
  '-',
]

console.log('Valid hostnames:')
for (const [input, expected] of validTests) {
  const result = validateHostname(input)
  const status = result === expected ? '' : `⛔ FAIL (got ${result})`
  console.log(`  ${input.padEnd(20)} ->  ${expected} ${status}`)
}

console.log('\nInvalid hostnames:')
for (const input of invalidTests) {
  const result = validateHostname(input)
  const status = result === undefined ? '' : `⛔ FAIL (got ${result})`
  console.log(`  ${input.padEnd(20)} -> undefined ${status}`)
}
