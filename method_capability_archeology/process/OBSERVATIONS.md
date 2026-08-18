# Invoice Suite Archeology — Process Observations

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** live fourth-site process capture. These observations pressure the three-site method; they are not product authority.

## IAO-001 — sparse history expands UNKNOWN; it does not lower the evidence threshold

The CI repair sequence preserves exact diffs but not failure logs or detailed rationale.

Correct result:

```text
transition event      OBSERVED
repair relation       sometimes SUPPORTED INFERENCE
trigger / motive      UNKNOWN where trace absent
```

Do not compensate for thin history with confident storytelling.

## IAO-002 — state-transition confidence can exceed causal-rationale confidence

A repository can establish with high confidence that:

```text
root lock moved Puppeteer 21 -> 24
Chrome install was added before PDF/test execution
```

while leaving unknown:

```text
which exact CI failure caused the change
who diagnosed it
whether the repair was reactive or proactive
```

Archaeology standing must be assignable per relation, not per finding as one global confidence label.

## IAO-003 — commit messages are limited contemporaneous interpretations

Examples:

```text
Update ci.yml
Fix CI deps on ubuntu-latest
github workflow fix
```

The message can nominate the problem class. It does not supersede the diff and may substantially underdescribe it.

`github workflow fix` changes root dependency-lock state, not the workflow file itself.

Portable rule:

```text
commit message
    evidence of contemporaneous labeling

commit diff
    evidence of repository state transition

neither alone
    full causal explanation
```

## IAO-004 — current tests can reveal why a configuration relation is necessary without revealing why it was added

Current CLI smoke tests call `generatePdf()` directly. Therefore the current test job truly requires browser materialization.

That establishes current structural necessity of the Chrome-install step.

It does not prove that a particular missing-browser failure was observed before the step was added.

This distinction is important:

```text
CURRENT NECESSITY
!=
HISTORICAL TRIGGER
```

## IAO-005 — a current polished design rationale is not formation history

README says engine-first/thin-adapter architecture isolates business logic and improves portability/testability. That may be accurate current rationale.

Until predecessor/transition traces are recovered, archaeology must not rewrite it as:

```text
problem X occurred
→ team chose engine-first because Y
```

Current explanation and historical cause are separate evidence classes.

## IAO-006 — root/package-local lockfiles can expose a repair relation invisible in prose

At `14ec4da...`, CLI manifest/package-local lock carry Puppeteer 24 while the workspace root lock still carries Puppeteer 21. The next commit reconciles the root lock to 24.

This relation is reconstructible from state comparison even though no prose explains it.

Portable candidate:

> In sparse software history, compare parallel machine-readable state surfaces before searching for narrative rationale.

## IAO-007 — retrieval substrate can create false absence

Empty-query commit search returned nothing while keyword searches recovered multiple commits.

Therefore:

```text
search route returns no history
-/→ repository has no relevant history
```

Negative retrieval claims must preserve query/visibility route even in ordinary software archaeology.

## IAO-008 — current survivor plus exact diffs can be sufficient for bounded mechanism archaeology

Rich predecessor/rationale records are not always necessary to answer a narrower question such as:

```text
what current dependency exists?
which transition introduced it?
what nearby state had to be reconciled?
```

They remain necessary for stronger claims about motive, decision process, rejected alternatives or causal attribution.

This narrows the three-site method's trace-bundle burden under sparse history.

## IAO-009 — missing review/admission semantics should remain missing

Invoice Suite has ordinary Git/default-branch integration. No source-native evidence currently establishes a separate semantic admission operation comparable to Site C.

Do not invent:

```text
commit to master
= explicit semantic admission ceremony
```

The repository supports `integrated state on master`; anything stronger is UNKNOWN unless a PR/review/release trace establishes it.

## IAO-010 — rich-history method must degrade gracefully

The three-site method cannot require:

```text
explicit predecessor record
explicit pressure record
explicit inferential ceiling object
explicit disposition vocabulary
```

in every repository.

It can instead ask:

```text
which of these relations are recoverable?
which are absent?
what weaker question remains answerable safely?
```

A robust archaeology method should reduce claim strength before expanding invented structure.

## IAO-011 — first visible repository state may already be a formed object

Invoice Suite's first commit introduces the engine, both adapters, CI, tests, docs, changelog, contribution rules and the design-decision table together.

The repository therefore begins after substantial object formation has already occurred.

Portable rule:

```text
FIRST COMMIT
!=
FORMATION ORIGIN
```

Treat the earliest surviving state as an **archive horizon**. If it already contains a coherent architecture, the pre-horizon formation pathway remains UNKNOWN unless another substrate supplies it.

## IAO-012 — contemporaneous rationale can be real without being genealogy

The initial README already gives engine-first/thin-adapter/monorepo rationale. That makes the rationale contemporaneous with repository inception.

It still does not establish:

```text
which problem produced the choice
which alternatives were rejected
where the decision was first made
```

A first-state explanation can describe an already formed object accurately while remaining silent about how it formed.

## IAO-013 — document dates are claims until tied to an independent chronology surface

`CHANGELOG.md` labels `0.1.0` as `2025-01-05`, while the first visible commit is `2026-01-06`.

Without an independently recovered tag, release, predecessor repository or other dated trace, archaeology must preserve both possibilities among others:

```text
real pre-Git project/release history
metadata/date error
```

Neither can be promoted from the document date alone.

Portable rule:

```text
embedded date
    observed metadata

embedded date + independent trace
    supported chronology
```

## IAO-014 — operative negative knowledge can outlive genealogical negative knowledge

The current workflow preserves guards for package availability and browser materialization even though the exact original failures and dispositions are not recovered.

This requires two relations:

```text
OPERATIVE NEGATIVE KNOWLEDGE
    current guard/discriminator shaped by a failure class

GENEALOGICAL NEGATIVE KNOWLEDGE
    recoverable failure + disposition + alternatives + reopening basis
```

A repository may preserve the first after losing the second.

Do not infer a rich historical failure narrative merely because a mature guard exists. Do not dismiss the guard as non-knowledge merely because its genealogy is missing.

## IAO-015 — challengeability can survive through current perturbation after historical challenge routes disappear

Sites with rich failure traces can reopen a claim by replaying original evidence/disposition.

Sparse software may instead permit:

```text
remove / alter current guard
→ execute current test/workflow surface
→ observe whether the forbidden condition recurs
```

This is an **executable challenge** to current necessity, not a reconstruction of the original historical defect.

Portable distinction:

```text
GENEALOGICAL CHALLENGE
    reopen original basis

EXECUTABLE CHALLENGE
    perturb current guard under current basis
```

The two routes answer different questions.

## IAO-016 — NOT APPLICABLE is a positive transfer result

Site D lacks a separate semantic admission institution, non-owning pressure gate and authority-local identity machinery comparable to Site C.

Correct transfer standing is:

```text
NOT APPLICABLE AT THIS SITE
```

not:

```text
weakly confirmed by analogy
```

A cross-site method compounds by learning where a relation does not exist as much as by accumulating recurrences.

## Current fourth-site corrections

The three-site step:

```text
recover pressure/input/failure
```

becomes:

```text
recover pressure/input/failure if surviving trace supports it
else preserve trigger UNKNOWN
and continue with bounded transition/mechanism reconstruction
```

The history boundary becomes explicit:

```text
locate earliest surviving state
→ determine whether it is already formed
→ mark archive horizon
→ do not identify archive horizon with formation origin
```

Negative knowledge becomes layered:

```text
recover current guard/discriminator
→ separately ask whether failure genealogy survives
→ use genealogical challenge when available
→ otherwise use executable challenge only for current necessity
```

The method should reduce claim strength before inventing missing structure and should treat non-applicability as evidence about scope.