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
  ['https://cssnr.com/', 'cssnr.com'],
  ['https://cssnr.com/path', 'cssnr.com'],
  ['https://cssnr.com:8080/path', 'cssnr.com:8080'],
  ['cssnr.com/path', 'cssnr.com'],
  ['HTTPS://CssNr.com/Path', 'cssnr.com'],
  ['https://*.example.com/path', '*.example.com'],
  ['[::1]', '[::1]'],
  ['[::1]:8080', '[::1]:8080'],
  ['[::1]:80', '[::1]:80'],
  ['http://[::1]/', '[::1]'],
  ['http://[::1]:8080/path', '[::1]:8080'],
  ['[2001:0db8:0000:0000:0000:ff00:0042:8329]', '[2001:db8::ff00:42:8329]'],
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
  'https://',
  'https://-example.com',
  '[not-ipv6]',
  '[::1]:abc',
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
