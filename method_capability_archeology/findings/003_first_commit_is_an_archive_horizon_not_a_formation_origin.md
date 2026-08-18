# Finding 003 — First Commit Is an Archive Horizon, Not a Formation Origin

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** OBSERVED archive boundary; SUPPORTED INFERENCE about preserved design state; pre-repository formation remains UNKNOWN.

## Question

What can Invoice Suite's first visible Git state establish about the formation of its engine-first / thin-adapter / monorepo architecture?

## Current claim under pressure

Current `README.md` explains the product through a portable zero-dependency invoice engine with CLI and Google Workspace adapters, and gives explicit design rationales for engine-first structure, thin adapters, monorepo organization, strict TypeScript, and zero engine runtime dependencies.

A tempting archaeology narrative would be:

```text
repository history
→ shows project choosing engine-first architecture
→ current rationale is recovered formation history
```

The surviving history does not establish that.

## Exact first visible state

The first repository commit is:

```text
90c99ec7765d185ff9202e9490de1ccbd03d4db3
Initial commit
2026-01-06T12:08:06Z
```

That commit introduces the project as an already formed multi-surface object. Its diff includes, in the same initial repository transition:

```text
README.md
CHANGELOG.md
CONTRIBUTING.md
CI workflow
root package/workspace configuration
invoice-engine package
cli-demo package
google-addon package
fixtures
docs
```

The initial `README.md` already says:

```text
portfolio-grade invoice generation system
demonstrating clean architecture, engine-first design, and platform adapters
```

and already contains the architecture diagram plus the explicit design-decision table:

```text
Engine-first      → business logic isolated, tested independently, reusable
Thin adapters     → platform code only does I/O, delegates computation
Monorepo          → shared types, atomic changes, single CI pipeline
TypeScript strict → compile-time checks / self-documenting API
No runtime deps   → portable engine
```

The initial `CHANGELOG.md` also already describes the three-package architecture and the technical notes that business logic is isolated in the engine and adapters remain thin.

## Later README movement

Subsequent README changes do not show the architecture being invented after repository inception.

Observed examples:

```text
2737e2c...  Update README.md
    alignment-only changes in the architecture diagram

04f9d61...  Update README.md
    "What This Demonstrates" -> "This Demonstrates"

 a820111... Update README.md
    opening rewritten from portfolio framing
    to product-first description
    while preserving the same engine/adapters/monorepo architecture
```

The product framing changes. The architecture relation survives.

## Archive horizon

The first commit is therefore an **archive horizon** for this repository.

It establishes:

```text
OBSERVED
- architecture and rationale are present at first visible Git state;
- engine, adapters, workspace, tests/docs/CI arrive together;
- later README edits preserve the architectural relation.
```

It supports:

```text
SUPPORTED INFERENCE
- the repository was initialized after substantial design formation had already occurred somewhere;
- current architecture rationale is contemporaneous with repository inception, not merely a late retrospective rewrite.
```

It does **not** establish:

```text
UNKNOWN
- where the architecture was first conceived;
- which alternatives were considered or rejected;
- whether a predecessor implementation existed elsewhere;
- why engine-first was selected at the moment of decision;
- whether the initial repository import was generated from another private/local source tree;
- whether 2025-01-05 in CHANGELOG reflects a real earlier release, a drafting date, or a date error.
```

## Changelog date trap

Current and initial `CHANGELOG.md` label `0.1.0` as:

```text
2025-01-05
```

while the first visible Git commit is on:

```text
2026-01-06
```

No admissible tag/release trace has been recovered through the current repository routes. Public search also did not reliably surface repository-specific release evidence.

Therefore the changelog date remains document metadata, not independently verified release chronology.

Do not infer either:

```text
"the project existed in released form for one year before Git"
```

or:

```text
"the changelog year is definitely a typo"
```

without additional evidence.

## Method consequence

Repository archaeology needs an explicit archive-horizon operation:

```text
locate earliest surviving repository state
→ ask whether it is already a formed object
→ if yes, mark the left edge as an archive horizon
→ distinguish first visible state from formation origin
→ seek predecessor substrate only when the question requires it
→ otherwise preserve pre-horizon formation as UNKNOWN
```

This is especially important in sparse software repositories, imports, migrations, squashed histories, repository recreations, and code drops.

## Relation to prior sites

The first three sites often preserve predecessor/supersession/current-state relations inside the repository. Invoice Suite shows the opposite case: the repository can be internally exact from its first commit onward while still beginning after the consequential design work.

The shared standing-reconstruction capability therefore needs two different boundaries:

```text
RIGHT/CURRENT BOUNDARY
    what currently survives and has standing?

LEFT/ARCHIVE BOUNDARY
    how far back can surviving traces support formation claims?
```

A strong current survivor does not repair a missing left edge.

## Reopening conditions

Reopen this finding if any of the following becomes available:

- a predecessor repository or branch;
- pre-Git local history;
- a tag/release with independently dated `0.1.0` provenance;
- issue/PR/chat/design material predating `90c99ec...`;
- an import/migration record explaining the initial commit source.

Until then, pre-repository design formation remains UNKNOWN.