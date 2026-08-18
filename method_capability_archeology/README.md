# Invoice Suite — Method and Capability Archeology

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Standing:** non-owning retrospective archaeology over an ordinary software repository with sparse formation/governance history. This branch does not change product code, CI, release standing, package semantics, or `master` authority.

**Formation basis:** `master@922ceb6ab93f548f33769d34da6cb803e8ce6813`

## Function

Pressure the Estate's standing-reconstruction method against a repository that lacks the rich current-state, adjudication, work-item and gate surfaces present in the first three archaeology sites.

The fourth-site question is not whether ordinary Git history can be made to look like a governed research institution. It is what can still be reconstructed safely when surviving traces are mostly:

```text
current code / config / tests
README / CHANGELOG
commit messages
diffs
ordinary branch history
```

and when failure logs, review rationale, explicit ownership transitions and competitor-bearing adjudication may be absent.

## Authority boundary

For this repository:

```text
master
    current integrated product state

README / CHANGELOG
    current/public explanatory surfaces

code / tests / workflow
    current executable/behavioral surfaces

commit history
    historical transition substrate
```

No stronger internal authority graph is presumed unless exact traces establish it.

Archaeology may reconstruct state transitions and supported design/repair relations. It may not invent missing failure logs, private motives, review decisions, or admission semantics absent from this repository.

## Evidence standing

```text
OBSERVED
    exact current artifact, diff, commit, test/config relation

SUPPORTED INFERENCE
    multiple exact traces constrain a likely relation but do not state motive/causality directly

UNKNOWN
    surviving substrate does not warrant stronger reconstruction
```

Sparse history should increase UNKNOWN, not lower the evidentiary threshold.

## Initial pressure object

Recover how browser-dependent PDF generation became executable in CI.

Current CI installs Puppeteer Chrome for both CLI tests and demo PDF generation. Current CLI tests invoke PDF generation directly. The recent sparse commit chain includes branch-trigger repair, Ubuntu dependency repair, Puppeteer/lockfile reconciliation, Chrome installation for the demo job, then Chrome installation for the test job.

The archaeology must separate:

```text
what changed
from
why it changed
```

when only the first is strongly preserved.

## Site order

```text
1. current product/workflow/test surface
2. exact diff sequence
3. commit message as limited contemporaneous interpretation
4. README/CHANGELOG only for current design description
5. UNKNOWN where logs/rationale are absent
```

Commit messages nominate motive; they do not make an opaque diff self-explanatory.

## Re-entry

```text
README.md
→ CURRENT.md
→ one bounded finding
→ SOURCE_LEDGER.md for exact traces
→ process/OBSERVATIONS.md for method pressure
```

Do not retrofit Site-A/B/C governance nouns onto this repository.