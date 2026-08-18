# Invoice Suite Archeology — Current State

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** ACTIVE ARCHEOLOGY — fourth-site sparse-history pressure formed; three bounded findings now establish graceful degradation and an archive horizon.

## Exact basis

```text
master@922ceb6ab93f548f33769d34da6cb803e8ce6813
```

No AGENTS/work-program/adjudication subsystem is present. `master` is the current integrated product state.

The archaeology remains branch-local and non-owning. It does not modify Invoice Suite product code, docs, CI or release state.

## Why this site matters

The first three archaeology sites preserve unusually rich durable state. Invoice Suite is ordinary software history: polished current docs, code/tests/CI, terse commits, and no explicit current authority map beyond Git/default branch.

It pressures two hidden assumptions in the compiled method:

```text
A. useful archaeology requires rich rationale/predecessor records
B. repository inception is close enough to formation origin
```

Both are false here.

## Finding 001 — sparse CI history

Question:

> How did browser-dependent PDF generation become runnable in CI, and what can surviving traces establish about the repairs?

Current workflow requires Puppeteer Chrome before CLI tests and before demo PDF generation. Current CLI smoke tests invoke PDF generation directly, so browser availability is a real test dependency.

Recovered transition chain:

```text
8d40e58  Update ci.yml
    workflow trigger main -> master

e288f55  Fix CI deps on ubuntu-latest
    libasound2t64 availability check / libasound2 fallback

14ec4da  fixed Github workflow incompatibility
    CLI package Puppeteer 21 -> 24
    package-local lockfile moves to Puppeteer 24

6d54bc3  github workflow fix
    workspace root lock reconciled Puppeteer 21 -> 24

83d7477  Install Chrome for demo PDF in CI
    explicit browser materialization before demo generation

922ceb6  Install Chrome for CLI tests in CI
    explicit browser materialization before test suite
```

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
```

Method correction:

```text
transition/mechanism confidence
can exceed
trigger/rationale confidence
```

A missing rationale does not make the event unknowable. A visible repair does not make its motivating failure known.

## Finding 002 — initial architecture rationale is not formation genealogy

Current README describes engine-first business logic, thin platform adapters, monorepo organization, strict TypeScript and zero runtime dependencies in the engine.

The first commit already introduces:

```text
README + architecture diagram + design-decision table
CHANGELOG
CONTRIBUTING
CI
invoice engine
CLI adapter
Google adapter
fixtures
docs
workspace/package structure
```

Later README edits preserve the same architecture while changing presentation/framing.

Therefore current design rationale is contemporaneous with repository inception, but repository history does not show the architecture being selected from predecessors.

## Finding 003 — archive horizon

The first visible commit is:

```text
90c99ec7765d185ff9202e9490de1ccbd03d4db3
Initial commit
2026-01-06T12:08:06Z
```

It is already a coherent, formed product object.

Correct boundary:

```text
FIRST VISIBLE REPOSITORY STATE
    archive horizon

!=

FORMATION ORIGIN
```

Pre-repository questions remain UNKNOWN unless another substrate is found:

```text
where engine-first was first conceived
which alternatives were rejected
whether predecessor code existed
what decision pressure selected the architecture
whether the initial commit came from another local/private tree
```

`CHANGELOG.md` labels `0.1.0` as `2025-01-05`, one year before the first visible Git commit. No independent tag/release/predecessor trace has been recovered through the available routes, so that date remains document metadata rather than verified chronology.

## Fourth-site method corrections

The three-site method now degrades safely under sparse history.

### 1. Recover what survives, not the schema expected

```text
rich site
    predecessor + pressure + transition + interpretation + successor + current survivor

sparse site
    current survivor + exact diff + machine-state relation
    with rationale/trigger UNKNOWN where absent
```

The trace bundle is a menu of relations to recover, not a mandatory documentary template.

### 2. Split confidence by relation

One finding may contain:

```text
OBSERVED transition
SUPPORTED INFERENCE repair relation
UNKNOWN causal trigger
```

Do not assign one global confidence label to the whole narrative.

### 3. Compare machine-readable parallel state

Sparse software history can expose consequential relations through:

```text
manifest ↔ lockfile
package-local ↔ workspace-root state
test ↔ CI configuration
current behavior ↔ introducing diff
```

before any prose rationale is available.

### 4. Locate both history boundaries

```text
RIGHT/CURRENT BOUNDARY
    what currently survives / is integrated?

LEFT/ARCHIVE BOUNDARY
    how far back can surviving traces support formation claims?
```

A strong right edge does not repair a missing left edge.

### 5. Preserve missing institutional semantics as missing

Invoice Suite currently establishes integrated state on `master`. It does not establish a separate semantic admission operation comparable to Site C. Do not import one.

## Current fourth-site standing

The fourth site **does** materially change the shared method. It demonstrates that standing reconstruction can remain useful with sparse rationale if claim strength contracts to the surviving substrate.

It also falsifies a latent assumption that first commit can stand in for design origin.

What it does **not** yet establish:

```text
how the method behaves under genuinely squashed history with few useful diffs
how to treat conflicting contributor rationales
how to treat autogenerated commit messages at scale
how to reconstruct external issue/tracker causality when Git is thin
whether a shared Estate archaeology owner is warranted
```

## Next operations

1. compile the fourth-site correction into a portable cross-site delta rather than more local case accumulation;
2. pressure one relation that was strong on the first three sites against this sparse substrate and record any narrowing/retirement;
3. inspect PR/issue/review substrate only where a bounded question requires it;
4. propagate only earned fourth-site corrections back to the existing archaeology sites;
5. keep Invoice Suite archaeology branch-local unless product-side discoverability/admission becomes independently warranted.

## Re-entry

```text
README.md
→ CURRENT.md
→ findings/001...003 as needed
→ process/OBSERVATIONS.md
→ SOURCE_LEDGER.md only for exact traces
```
