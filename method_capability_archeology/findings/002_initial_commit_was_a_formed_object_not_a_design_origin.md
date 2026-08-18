# Finding 002 — Initial Commit Was a Formed Object, Not a Design Origin

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** OBSERVED repository-boundary fact + explicit UNKNOWN prehistory.

## Question

Does the repository history explain how Invoice Suite arrived at its current engine-first/thin-adapter architecture, or does Git begin only after that architecture was already formed?

## Current design rationale

Current README explains:

```text
engine-first
    business logic isolated and independently testable/reusable

thin adapters
    platform code handles I/O and delegates computation

monorepo
    shared types, atomic changes, one CI pipeline

strict TypeScript
    compile-time checking

zero runtime dependencies in engine
    portability across JavaScript environments
```

Current code/package layout is consistent with that description:

```text
invoice-engine
cli-demo
google-addon
```

The question is historical: when and why did this architecture form?

## Repository inception

Commit:

```text
90c99ec7765d185ff9202e9490de1ccbd03d4db3
Initial commit
```

is not a minimal seed. It imports an already broad product object including:

```text
CI workflow
CHANGELOG
CONTRIBUTING
README
engine package
CLI package
Google add-on
fixtures
documentation
monorepo/workspace configuration
```

The initial README already says:

```text
A portfolio-grade invoice generation system demonstrating clean architecture,
engine-first design, and platform adapters.
```

It already contains the architecture diagram and the same design-decision table naming engine-first, thin adapters, monorepo, strict TypeScript and zero engine runtime dependencies.

The initial CHANGELOG also already describes the v0.1.0 package split and technical notes:

```text
engine zero runtime deps
all business logic isolated in engine
adapters thin I/O layers
```

Therefore the repository's first visible state is already **post-design** in the relevant architectural sense.

## What first-commit contemporaneity establishes

The architecture rationale is not a late explanation invented after months of code evolution. It is present in the first repository snapshot alongside the implementation.

Safe claim:

```text
engine-first / thin-adapter rationale
was contemporaneous with repository inception
```

This is stronger than current-doc-only evidence.

## What it does not establish

The first commit has no repository predecessor.

It cannot establish:

```text
what earlier architecture existed, if any
which problem first motivated the split
whether Google or CLI adapter was designed first
which alternatives were rejected
whether portability or testability was the primary original driver
whether this repository was imported from another workspace/history
who made which design choice and when before Git inception
```

Thus:

```text
first visible state
!=
formation origin
```

and:

```text
rationale present at first commit
!=
proof that rationale caused the design
```

The repository begins after the decision boundary archaeology would most like to inspect.

## Later README evolution

Three later README changes help distinguish architecture from presentation.

### `2737e2c...` — `Update README.md`

Only adjusts diagram alignment spacing. No architectural claim changes.

### `04f9d61...` — `Update README.md`

Changes heading:

```text
What This Demonstrates
→ This Demonstrates
```

No architecture change.

### `a820111...` — `Update README.md`

Changes the opening from:

```text
portfolio-grade ... demonstrating clean architecture, engine-first design,
and platform adapters
```

to a product-first paragraph:

```text
Invoice Suite generates professional PDF invoices from structured data...
core engine ... zero dependencies...
CLI + Google adapters...
monorepo isolates business logic from platform I/O...
```

The underlying architecture/design-decision table remains the same.

This supports:

```text
presentation framing changed
while architectural self-description remained stable
```

It does not reveal the pre-repository formation path.

## Fourth-site method consequence — repository inception is an archaeological horizon

Rich archaeology often assumes history can be pushed backward until a predecessor/pressure relation appears.

This site imposes a hard boundary:

```text
FIRST COMMIT ALREADY FORMED
→ repository cannot answer prehistory from internal Git evidence alone
```

The correct archaeology output is not an invented predecessor. It is a horizon declaration:

```text
IN-REPOSITORY GENEALOGY
    starts at an already formed architecture

PRE-REPOSITORY FORMATION
    UNKNOWN from current repository substrate
```

External/local history could later reopen it.

## Pressure on current-service interpretation

The current README is useful evidence for what the architecture claims now and, because the same rationale is present at initial commit, for what the repository claimed at inception.

It is not evidence for the causal route that generated the architecture before inception.

This creates three distinct statuses for explanatory prose:

```text
CURRENT EXPLANATION
    what the object says now

CONTEMPORANEOUS REPOSITORY-INCEPTION EXPLANATION
    what first visible state already said

FORMATION CAUSALITY
    why/how that design came to exist before first visible state
```

The first two are observed. The third is UNKNOWN.

## Cross-site consequence

Sites A/B/C often have predecessor traces because their institutions deliberately preserve state formation. Site D shows the method must support a **left-censored genealogy**:

```text
unknown prehistory
→ first observed formed state
→ later observable repairs/evolution
```

Portable rule:

> Treat repository inception as an evidence boundary. Do not convert the earliest surviving artifact into an origin event unless an external/predecessor trace establishes that relation.

## Negative knowledge

Do not write:

```text
The project chose engine-first architecture in the initial commit because portability and testability mattered.
```

The repository supports only:

```text
The initial repository state already used and explicitly described engine-first architecture, citing portability/testability/reuse as rationale.
```

Whether those cited reasons are causal formation history is not recoverable here.

## Reopening conditions

Prehistory could strengthen if recovered from:

```text
older local Git repository
pre-import branch/archive
project brief
prior prototype
issue/PR from another repository
contemporaneous chat/email/spec
filesystem timestamps plus substantive predecessor artifacts
```

Without such substrate, pre-repository architecture formation remains UNKNOWN.

## Current disposition

```text
CURRENT ENGINE-FIRST ARCHITECTURE
    OBSERVED

SAME ARCHITECTURE/RATIONALE AT FIRST COMMIT
    OBSERVED

LATER README PRESENTATION REFRAMING
    OBSERVED

PRE-REPOSITORY PREDECESSOR / DECISION PATH
    UNKNOWN

FIRST COMMIT AS FORMATION ORIGIN
    NOT LICENSED

ARCHAEOLOGY METHOD
    must support left-censored histories
```
