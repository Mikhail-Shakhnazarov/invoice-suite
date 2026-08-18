# Finding 004 — Negative Knowledge Survived as Operational Guard Without Deep Failure Trace

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** OBSERVED guard transitions and current survivor; SUPPORTED INFERENCE that repairs encode failure-sensitive knowledge; original failure/disposition history remains UNKNOWN.

## Cross-site question

Three prior archaeology sites supported a strong relation:

```text
failure / counterexample
→ disposition
→ changed object or standing
→ compact current guard / discriminator
→ deep failure trace retained for challenge
```

Does that relation survive in an ordinary sparse software repository?

## Initial CI state

At first visible repository state `90c99ec...`, CI already has a PDF demo job and a test job.

The initial workflow:

```text
test job
    install dependencies
    build packages
    run pnpm test
    no explicit Puppeteer browser install

demo-pdf job
    install Chromium OS libraries
    unconditional libasound2
    build packages
    generate demo PDF
    no explicit Puppeteer browser install
```

Initial workflow blob:

```text
e96855ea74a0cd23580bb56b0c2b9f796b4b0e0b
```

## Repair sequence

The later history introduces three classes of durable guard.

### 1. Distribution/package compatibility guard

`e288f55...` changes:

```text
unconditional libasound2
```

into:

```text
if libasound2t64 exists:
    install libasound2t64
else:
    install libasound2
```

The current workflow still carries this branch.

This is an executable discriminator over runner package availability.

### 2. Workspace dependency-state reconciliation

`14ec4da...` moves the CLI package to Puppeteer 24 while the workspace root lock still carries Puppeteer 21.

`6d54bc3...` then reconciles the root lock to Puppeteer 24.

The current workspace state preserves the repaired dependency relation.

### 3. Browser-materialization guards

`83d7477...` adds:

```text
pnpm --filter @invoice-suite/cli-demo exec puppeteer browsers install chrome
```

before demo PDF generation.

`922ceb6...` adds the same browser materialization before the repository-wide test suite.

Current CLI tests call PDF generation directly, so this is not inert historical residue. It remains necessary for the current test topology.

## What survived

The current object contains executable knowledge of conditions that must be handled:

```text
Ubuntu runner may expose libasound2t64 instead of libasound2
Puppeteer package state must be workspace-consistent
browser binary must be materialized before PDF-producing tests/demo
```

That knowledge is not preserved mainly as explanatory prose. It is preserved as behavior.

This supports:

```text
SUPPORTED INFERENCE
repair-sensitive knowledge
→ executable guard/current invariant
```

The guard is evidence that some incompatibility class mattered enough to change the object. It is not evidence of the exact incident that first revealed it.

## What did not survive

The searched repository surfaces do not currently preserve:

```text
exact failed Actions run
exact error message
issue describing the failure
PR discussion diagnosing it
formal disposition such as DEFEATED / REJECTED / RESOLVED
rejected repair alternatives
explicit reopening condition
```

Issue search for `Puppeteer` and `CI` returned no matching issue/PR surface through the installed route. This is a bounded retrieval result, not proof of global nonexistence.

## Transfer result

The three-site relation is too strong as a universal requirement.

What survives four sites is:

```text
failure-sensitive knowledge
→ changed object / standing
→ current guard / discriminator
```

Where historical substrate is rich, archaeology should also recover:

```text
disposition
challenge/reopening route
deep failure trace
```

Where those traces are absent, the current guard itself can preserve **operative negative knowledge** without preserving **genealogical negative knowledge**.

Therefore:

```text
OPERATIVE NEGATIVE KNOWLEDGE
    a current constraint/guard shaped by a failure class

GENEALOGICAL NEGATIVE KNOWLEDGE
    recoverable account of the failure, disposition, alternatives and reopening basis
```

They are related but not identical.

## Method correction

A portable archaeology should ask two separate questions:

```text
1. What current guard or discriminator exists because some nearby state is unsafe/invalid?
2. Can the historical failure/disposition that produced it still be reconstructed?
```

Do not infer a missing genealogy from a mature guard. Do not dismiss the guard as ahistorical merely because the genealogy is absent.

## Consequence for challengeability

Sites A–C supported strong challengeability because deep traces survived. Invoice Suite shows a weaker but still useful condition:

```text
current guard can be inspected and tested
but original rationale may not be challengeable on its own historical terms
```

The reopening route then shifts from:

```text
replay original defect / inspect disposition
```

 toward:

```text
remove or perturb current guard
→ run the executable surface
→ observe whether the forbidden/unsupported condition recurs
```

That is a different evidence route and should be named as such.

## Reopening conditions

Reopen if any of the following appears:

- Actions logs for the relevant commits;
- issue/PR/review discussion;
- local development notes;
- a predecessor branch with explicit failure reproduction;
- a test added specifically to freeze one of these CI failures.

Until then, the operational lesson is recoverable more strongly than its genealogy.