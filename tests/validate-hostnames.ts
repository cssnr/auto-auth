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
  ['*.example.com', '*.example.com'],
  ['staging.**', 'staging.**'],
  ['staging.**.example.com', 'staging.**.example.com'],
  ['**.example.com', '**.example.com'],
  ['staging.**:8080', 'staging.**:8080'],
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
  'example.***.com',
  '.',
  '-',
]

let failed = 0

console.log('Valid hostnames:')
for (const [input, expected] of validTests) {
  const result = validateHostname(input)
  const passed = result === expected
  if (!passed) failed++
  const status = passed ? '' : `⛔ FAIL (got ${result})`
  console.log(`  ${input.padEnd(20)} ->  ${expected} ${status}`)
}

console.log('\nInvalid hostnames:')
for (const input of invalidTests) {
  const result = validateHostname(input)
  const passed = result === undefined
  if (!passed) failed++
  const status = passed ? '' : `⛔ FAIL (got ${result})`
  console.log(`  ${input.padEnd(20)} -> undefined ${status}`)
}

if (failed > 0) process.exitCode = 1
