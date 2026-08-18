# Finding 001 — Sparse CI History Recovered Repairs but Not Failure Rationale

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** OBSERVED transition sequence + SUPPORTED repair relations + explicit UNKNOWN causal trigger.

## Question

Can standing reconstruction remain useful when the repository preserves current code/tests and terse diffs but no explicit adjudication object, failure log, work item or review rationale?

The browser-dependent PDF CI sequence supplies a fourth-site test.

## Current endpoint

Current CI on `master`:

```text
TEST JOB
    root pnpm install
    build packages
    install Puppeteer Chrome
    run pnpm test

DEMO PDF JOB
    root pnpm install
    install Linux Chromium libraries
    build packages
    install Puppeteer Chrome
    run pnpm demo:pdf
    verify Invoice_*.pdf exists
    upload PDF artifact
```

Current CLI smoke tests invoke `generatePdf()` in multiple PDF-generation cases and in the end-to-end pipeline. Browser availability is therefore a current executable requirement of both the dedicated demo path and the CLI test path.

**Standing:** OBSERVED.

## Transition 1 — branch trigger repaired

Commit:

```text
8d40e58a4b70fd1b4053c0206daed358939bc7e1
Update ci.yml
```

changes:

```text
workflow push / pull_request branches
main -> master
```

Repository default branch is `master`.

What this establishes:

```text
workflow trigger configuration was aligned with current default branch
```

What it does not establish:

```text
whether CI had actually failed to run
how the mismatch was discovered
whether branch naming changed earlier
```

**Event:** OBSERVED.  
**Historical trigger:** UNKNOWN.

## Transition 2 — Ubuntu audio dependency made conditional

Commit:

```text
e288f55e340be24bb46c0abc0d416bf70c5bd856
Fix CI deps on ubuntu-latest
```

changes:

```text
libasound2
→
if libasound2t64 exists:
    install libasound2t64
else:
    install libasound2
```

The message and diff jointly establish an Ubuntu package-compatibility repair in the Chromium dependency installation path.

They do not establish the exact apt error, runner image generation or failed Actions run.

**Repair class:** OBSERVED.  
**Exact failure:** UNKNOWN.

## Transition 3 — CLI Puppeteer dependency moved to 24

Commit:

```text
14ec4da08b2f8ddda61c568a814b3f1c15a6ba83
fixed Github workflow incompatibility
```

changes CLI package dependency:

```text
puppeteer ^21.7.0
→ ^24.34.0
```

and creates/updates a package-local lockfile consistent with Puppeteer 24.

At the same commit, the repository root workspace lock still records the `packages/cli-demo` importer at Puppeteer 21.11.

So the repository contains, transiently:

```text
CLI package manifest      Puppeteer 24
CLI package-local lock    Puppeteer 24
workspace root lock       Puppeteer 21
```

**Standing:** OBSERVED state divergence.

The commit message calls this a GitHub workflow incompatibility. It does not say why Puppeteer 24 resolves the incompatibility.

## Transition 4 — workspace root lock reconciled

Commit:

```text
6d54bc3bb76b00d78d0b18bca5f9eac4f9376f22
github workflow fix
```

parent:

```text
14ec4da08b2f8ddda61c568a814b3f1c15a6ba83
```

changes only root `pnpm-lock.yaml`, including:

```text
packages/cli-demo importer
Puppeteer 21.11
→ Puppeteer 24.34
```

Current/root CI runs `pnpm install` from repository root. The immediately preceding package state already requires Puppeteer 24 while the root lock still pins 21.

Supported reconstruction:

```text
package dependency moved
+ workspace root lock remained old
→ root workspace install state diverged
→ next commit reconciled root lock to package state
```

This is stronger than simply reading the message `github workflow fix`, because the parallel machine-readable surfaces constrain what changed.

It still does not license:

```text
exact pnpm error text
assertion that CI definitely failed before the commit
private reason for choosing Puppeteer 24
```

**Repair relation:** SUPPORTED INFERENCE.  
**Exact failure trigger:** UNKNOWN.

## Transition 5 — browser installation added to demo job

Commit:

```text
83d74776dc9cb9b740b124b17c16fef0cab69c18
Install Chrome for demo PDF in CI
```

adds immediately before PDF generation:

```text
pnpm --filter @invoice-suite/cli-demo exec puppeteer browsers install chrome
```

This directly establishes that the CI demo job was changed to materialize Puppeteer's browser before executing browser-dependent PDF generation.

**Standing:** OBSERVED.

## Transition 6 — browser installation added to test job

Commit:

```text
922ceb6ab93f548f33769d34da6cb803e8ce6813
Install Chrome for CLI tests in CI
```

adds the same browser-install command immediately before `pnpm test`.

Current CLI smoke tests directly call PDF generation. Therefore the present test job has a real browser dependency; the new step satisfies that current dependency.

What remains unproven is whether the commit was triggered by an observed browser-not-found failure or added after proactive inspection.

**Current necessity + transition:** OBSERVED.  
**Historical trigger:** UNKNOWN.

## What the sparse history actually supports

A strong bounded pathway is recoverable:

```text
workflow trigger points at wrong branch
→ trigger corrected to master

Chromium dependency list assumes one Ubuntu package name
→ conditional package compatibility added

CLI package moves to Puppeteer 24
while root workspace lock remains Puppeteer 21
→ root lock reconciled to 24

browser-dependent demo path lacks explicit browser materialization
→ Chrome installation added before demo

browser-dependent test path lacks explicit browser materialization
→ Chrome installation added before tests
```

This is a history of **repository state repairs**.

It is not a fully recovered history of diagnosis.

## Sparse-history method consequence

The first three sites encouraged trace bundles containing predecessor, pressure/input, transition, interpretation and successor. Fourth-site pressure shows that useful archaeology must permit an asymmetric bundle:

```text
PREDECESSOR STATE        strong
TRANSITION DIFF          strong
CURRENT SURVIVOR         strong
CURRENT STRUCTURAL NEED  strong
COMMIT LABEL             weak/moderate interpretation
FAILURE LOG              absent
DECISION RATIONALE       absent
REJECTED ALTERNATIVES    absent
```

The correct response is not to reject the archaeology as impossible and not to infer the missing middle from technical obviousness.

Portable rule:

> When rationale substrate is absent, preserve high-confidence transition/mechanism reconstruction and lower causal/motive standing independently.

## Pressure on the three-site procedure

Three-site step:

```text
recover pressure/input/failure
```

needs a sparse-history branch:

```text
attempt to recover pressure/input/failure

if absent:
    record searched/visible substrate
    leave trigger UNKNOWN
    continue only with questions answerable from transition + survivor evidence
```

A missing causal bridge limits **which claim** can be made; it does not erase observed transitions.

## Commit-message ceiling

The sequence also demonstrates:

```text
commit message
!= diff semantics
```

`github workflow fix` changes dependency lock state; `Update ci.yml` says nothing about branch mismatch; more descriptive browser commits still do not carry run logs.

Use commit messages as contemporaneous labels, not omniscient rationale.

## Current documentation ceiling

README and CHANGELOG accurately describe the current product and CI-visible architecture at a high level. They do not preserve this repair pathway.

Therefore:

```text
current polished rationale / product description
!= formation history
```

This is not a defect by itself in an ordinary software repo. It is a limit on what archaeology may claim from current docs.

## Negative knowledge

Do not write:

```text
CI failed because Chrome was missing
```

without the failed run/log.

Safe form:

```text
browser installation was added immediately before browser-dependent PDF/test execution;
current tests require that browser path;
the exact motivating failure is not preserved in recovered traces.
```

Do not write:

```text
Puppeteer was upgraded to fix CI bug X
```

when the repository only preserves `fixed Github workflow incompatibility` plus package/lock transitions.

## Reopening conditions

Strengthen causal reconstruction if any of the following becomes available:

```text
GitHub Actions failure logs
PR/issue discussion
commit comments
local development notes
external CI notifications
contemporaneous chat/handoff preserved elsewhere
```

If none survives, UNKNOWN is terminal for the private trigger while the state-transition genealogy remains usable.

## Current disposition

```text
CI REPAIR TRANSITIONS
    OBSERVED

WORKSPACE LOCK RECONCILIATION RELATION
    SUPPORTED INFERENCE

CURRENT BROWSER REQUIREMENT FOR CLI TESTS
    OBSERVED

EXACT FAILURE LOGS
    UNKNOWN / not recovered

PRIVATE DIAGNOSTIC RATIONALE
    UNKNOWN

SPARSE-HISTORY METHOD
    useful archaeology survives through claim-level confidence separation
```
