# TODO

## General

Items identified while refactoring the codebase that have not yet been resolved.

- Add ability to ignore a host from options
- Duplication in [popup/App.vue](src/entrypoints/popup/App.vue)/[HostsTable.vue](src/components/HostsTable.vue)
- Refactor how width is set in [popup/App.vue](src/entrypoints/popup/App.vue)
- Refactor importCredentials in [creds.ts](src/utils/creds.ts) to reduce complexity
- Refactor onMounted in [auth/App.vue](src/entrypoints/auth/App.vue) to catch and handle errors
- Refactor generateIcons to replace auto-icons in [wxt.config.ts](wxt.config.ts)
- Refactor useOptions to use provide from APP and inject from component
- Look into refactoring HostModal to be "provided" to the components
- Cleanup functions in [utils/index.ts](src/utils/index.ts)

## Logging

Logging items not cleaned up during v1 refactoring.

- Check all `TODO: Logging` comments in code
- Cleanup Logging in [App.vue](src/entrypoints/auth/App.vue)
- Cleanup Logging in [auth.ts](src/entrypoints/background/auth.ts)
- Cleanup Logging in [creds.ts](src/utils/creds.ts)
- Cleanup Logging in [content/index.ts](src/entrypoints/content/index.ts)

## Version 2 Notes

The Wildcards release will bump to version 2 and have some notes...

### Default Ports

Bare-entered keys with a scheme-default port (`example.com:80`, `example.com:443`)
are stored literally, but the request side strips the default port for the request's
scheme (`http://...:80` and `https://...:443` both become portless in `url.host`).
A portless entry (`example.com`) matches any port and scheme via the fallback in
[hosts.ts](src/utils/hosts.ts), but a literal `:80`/`:443` entry only ever matches
the opposite-scheme request (e.g. `example.com:80` only matches `https://example.com:80/`),
so it is effectively inert. The scheme of a bare host is unknown at entry time,
so it cannot be stripped there.

Consider warning on or stripping explicit scheme-default ports (`:80`, `:443`)
in [validateHostname](src/utils/hosts.ts), or normalizing full-URL entries only
(which already strip the default port via `url.host`)

### Entries Without Ports Now Match Any Port

Before, a saved host without a port (`example.com`) only matched requests to that
host with no port. Now it also matches the same host on any port
(`example.com:8080`, `example.com:8443`, and so on).

This is a behavior change for existing saved credentials: they will now be sent to
ports they were never sent to before. Works as intended, but should be called out
clearly in the release notes. Consider making it opt-in.

### Typing a Port Now Keeps the Port

Before, entering a host with a port (`example.com:8080`) was saved without the port
(`example.com`), so it matched every port. Now the port is kept (`example.com:8080`),
so it only matches requests to that exact port.

Users who saved a site "with the port" to make it work on any port will notice it
stops matching other ports after upgrading. Existing saved entries are not changed,
only how new ones are stored.

NOTE: Confirm this mattered and that ports were not broken on master branch...

### Wildcard Matching

**6. LOW — overlapping-entry hygiene.** `Hosts.has` (`hosts.ts:11-14`) is exact-only, so users can now add `example.com:*` next to a portless `example.com` — the wildcard can never apply (portless exact always wins, `hosts.ts:28-33`) and becomes dead weight. Also `*.example.com` alongside `**.example.com` is allowed with no warning. Acceptable, but worth a nudge in the modal.

#### Root cause

The duplicate check in `HostModal.vue:83` is `Hosts.has()` (`hosts.ts:11-14`), which only compares the **exact string** of the new key against existing keys in the same bucket. It has no concept of "does this entry overlap or get shadowed by another entry that matches the same requests."

So the modal only stops you from entering the _identical_ string twice. Anything that _effectively_ conflicts sails through.

#### The actual problems (verified, not theory)

**1. Portless-exact silently kills same-name wildcard patterns (dead weight).**
`find()` (`hosts.ts:21-36`) resolves in strict order: exact key → portless exact → wildcards. So for request `example.com:8080`, a stored portless `example.com` is checked at tier 2, _before_ any wildcard. A pattern like `example.com:*` only matches hosts literally named `example.com:<anyport>` — and the portless exact already covers all of those.

Verified:

```
seed { "example.com": "u1:p1", "example.com:*": "u2:p2" }
find("example.com:8080") -> key "example.com", creds "u1:p1"   // wildcard never fires
find("example.com")      -> key "example.com", creds "u1:p1"
```

So after adding `example.com:*`, it is 100% unreachable. And it's bidirectional — adding the portless `example.com` _after_ an existing `example.com:*` silently orphanizes the pattern the user already had. Neither direction warns.

**2. Any explicit `: *` port is redundant _by design_, and creates a coin-flip.**
Because port agreement already means "a pattern without a port matches any port" (`matchesWildcard` accepts it), `*.example.com:*` matches exactly the same requests as `*.example.com`, and `wildcardSpecificity` scores both as 20 (`hosts.ts:225-236` treats `*` port the same as no port). Verified:

```
tie winner (portless first):   key "*.example.com"
tie winner (star-port first):  key "*.example.com:*"   // insertion order wins
```

The winner with equal specificity is just "whichever object iterated first" (bucket order `[*_abc…]`, then insert order). So `: *` not only does nothing useful, it can silently _override_ the pattern the user actually meant to use — and both entries sitting in the table look equally valid.

**3. Partial overlaps are legal with zero visibility.**
`*.example.com` + `**.example.com` genuinely serve different host sets (`*.` wins on `a.example.com`, `**.` covers bare `example.com` and multi-level subs), so this can be intentional credential layering. But nothing in the UI tells the user one will win over the other, or why.

So: sub-issue 1 = dead/wasted entries (the real bug-like one), sub-issue 2 = redundant input that should arguably be rejected, sub-issue 3 = legitimate but opaque layering.

#### Possible fixes (cheapest → most invasive)

**Fix A — block fully-shadowed patterns at add time (recommended, small).**
Replace the `Hosts.has(host)` call with a `Hosts.conflicts(host)` that returns the entry that would shadow the proposed one, and show a "this is already covered by `example.com`" warning. Cheap approximation — compute a representative request host for the proposed key and run `find()` on it:

- if the proposed key has no `*`: representative = the key itself (handles `example.com:*` vs portless `example.com`; the portless exact wins the simulation)
- if the proposed key is a pattern: substitute a label for `*`/`**` (e.g. `a` / `a.b`) and keep the port, run `find()`
- if the simulation returns a _different existing_ entry that also matches → warn or block.

Also reject/normalize `: *` ports in `validateHostname` — they're semantically identical to no port at all, so just strip them (fixes sub-issue 2 for free).

**Fix B — write-time clean-up (aggressive).**
In `Hosts.set`/`update`/`delete`, after a write, drop entries the change fully shadowed and surface a "removed N unreachable entries" toast. Destructive and surprising; I'd only do this after Fix A exists.

**Fix C — read-side visibility (nice-to-have).**
In `HostsTable.vue`, mark rows that are currently unreachable (same representative-host simulation per row, cheap since the table already has the full dataset) with a muted/strikethrough style and a tooltip: "always overridden by `example.com`".

**Fix D — deterministic tie-break (complements #4).** When shadow-checking passes and two patterns legitimately overlap, at least make the winner stable and _explainable_ (e.g. longest literal prefix wins) instead of object iteration order.

My recommendation: **A + strip `: *`** for the release — it closes both the dead-entry hole and the redundancy silently. C and D are polish for after.

No comments modified; the repro script was temporary and has been deleted.
