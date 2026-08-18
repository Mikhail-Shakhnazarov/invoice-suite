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

## Current fourth-site correction candidate

The three-site step:

```text
recover pressure/input/failure
```

should become:

```text
recover pressure/input/failure if surviving trace supports it
else preserve trigger UNKNOWN
and continue with bounded transition/mechanism reconstruction
```

The method should not make causal-rationale recovery a prerequisite for every useful archaeology object.