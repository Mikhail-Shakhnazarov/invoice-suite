# Invoice Suite Archeology — Current State

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** ACTIVE ARCHEOLOGY — fourth-site sparse-history pressure formed; first CI reconstruction in progress.

## Exact basis

```text
master@922ceb6ab93f548f33769d34da6cb803e8ce6813
```

No AGENTS/work-program/adjudication subsystem is present. `master` is the current integrated product state.

## Why this site matters

The first three archaeology sites preserve unusually rich durable state. Invoice Suite is ordinary software history: polished current docs, code/tests/CI, terse commits, and no explicit current authority map beyond Git/default branch.

This pressures a possible hidden assumption in the compiled method:

```text
reconstructible institution
    has already preserved
    predecessor / pressure / rationale / standing transitions explicitly
```

Here that assumption is false.

## First bounded question

How did browser-dependent PDF generation become runnable in CI, and what can surviving traces establish about the repairs?

## Current observed endpoint

Current workflow:

```text
master push/PR triggers CI
root pnpm install
build packages
install Puppeteer Chrome before CLI tests
run pnpm test

separate demo-pdf job
install Linux Chromium dependencies
build packages
install Puppeteer Chrome
generate demo PDF
verify PDF file
upload artifact
```

Current CLI smoke tests call PDF generation directly in multiple tests and the end-to-end pipeline, so the test job genuinely has a browser dependency.

## Sparse transition coordinates recovered

```text
8d40e58  Update ci.yml
    workflow trigger main -> master

e288f55  Fix CI deps on ubuntu-latest
    libasound2t64 availability check / libasound2 fallback

14ec4da  fixed Github workflow incompatibility
    CLI package Puppeteer 21 -> 24
    package-local lockfile for Puppeteer 24 introduced/updated

6d54bc3  github workflow fix
    workspace root lock reconciled from Puppeteer 21 -> 24

83d7477  Install Chrome for demo PDF in CI
    explicit Puppeteer browser install before demo generation

922ceb6  Install Chrome for CLI tests in CI
    explicit Puppeteer browser install before test suite
```

Chronological ordering among `e288f55`, `14ec4da`, `6d54bc3`, `83d7477`, `922ceb6` is established by commit timestamps/parent chain around the final sequence. The exact earlier relation of `8d40e58` is separately observed before these repairs.

## Evidentiary asymmetry

Strongly recoverable:

```text
current required behavior
exact configuration changes
manifest/lockfile mismatch and reconciliation
browser dependency in tests
current survivor
```

Weak/unavailable:

```text
exact failing Actions logs
exact error messages
which commits reacted to failed runs vs proactive inspection
private rationale for Puppeteer upgrade
why package-local lockfile was created rather than only workspace root lock
```

The archaeology must preserve this asymmetry.

## Initial method correction

The three-site method says recover pressure/input/failure before transition. Sparse history requires a legal fallback:

```text
if failure/rationale trace is absent:
    reconstruct event + changed invariant
    use commit message only at its actual specificity
    infer motive only where multiple traces constrain it
    leave trigger/causal narrative UNKNOWN
```

A missing rationale does not make the event unknowable. A visible repair does not make its motivating failure known.

## Next operations

1. compile Finding 001 for CI/browser repair;
2. test a current design rationale such as engine-first/thin adapters against repository formation history;
3. record retrieval failures and sparse-history process corrections;
4. decide whether the fourth-site pressure narrows the shared standing-reconstruction procedure materially;
5. keep archaeology branch-local unless a public-product admission route becomes independently warranted.

## Re-entry

```text
README.md
→ CURRENT.md
→ findings/001...
→ process/OBSERVATIONS.md
→ SOURCE_LEDGER.md only for exact traces
```