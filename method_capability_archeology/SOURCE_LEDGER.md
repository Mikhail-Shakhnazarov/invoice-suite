# Invoice Suite Archeology — Source Ledger

© 2026 Mikhail Shakhnazarov. All rights reserved.

**Function:** exact traces consumed by fourth-site sparse-history archaeology. This ledger distinguishes current behavior, transition evidence, limited commit interpretation, and missing substrate.

## Current product surfaces

| Trace | Archaeological role |
| --- | --- |
| `master@922ceb6ab93f548f33769d34da6cb803e8ce6813` | Fourth-site formation/current basis. |
| `README.md@b364c5433e2a29eff1a8124f9b3b4cda2ad8cc37` | Current product/architecture description; evaluator-oriented demo paths; engine-first/thin-adapter rationale. |
| `CHANGELOG.md@4d733dced04ef6f143f1e0a0d227b2504ea7be36` | Current v0.1.0 feature/change summary and current technical notes. |
| `.github/workflows/ci.yml@454c2db00789eda3b64d8447d6d9f48f9c24466c` | Current CI survivor: master trigger, root install, browser installs, PDF demo verification/artifact. |
| `packages/cli-demo/package.json@25b58f98de898abc27c221fd4945eb3e968e5282` | Current Puppeteer 24 dependency and CLI scripts. |
| `packages/cli-demo/test/smoke.test.ts@cf32bf90bdddfee71595718bf53e24e38c5f32f9` | Current CLI tests invoke PDF generation directly. |
| root `package.json@965617688f654f9c6123548b0a3bf6eb21669774` | Root pnpm workspace install/build/test context. |

## Sparse CI repair transitions

### Branch trigger

```text
8d40e58a4b70fd1b4053c0206daed358939bc7e1
Update ci.yml
```

Observed diff:

```text
push/pull_request branch
main -> master
```

The repo default branch is `master`. This establishes the configuration correction. The commit message does not explain how the mismatch was discovered.

### Ubuntu package compatibility

```text
e288f55e340be24bb46c0abc0d416bf70c5bd856
Fix CI deps on ubuntu-latest
```

Observed diff:

```text
unconditional libasound2
→ if libasound2t64 exists, install it; else libasound2
```

This establishes a package-availability compatibility repair. No failed Actions log was recovered.

### CLI Puppeteer/package-local lock change

```text
14ec4da08b2f8ddda61c568a814b3f1c15a6ba83
fixed Github workflow incompatibility
```

Observed:

```text
packages/cli-demo/package.json
Puppeteer ^21.7.0 -> ^24.34.0

packages/cli-demo/pnpm-lock.yaml
Puppeteer 24-compatible package-local lockfile state
```

At this commit, the workspace root lock still records CLI Puppeteer 21.11 under the `packages/cli-demo` importer.

### Root workspace lock reconciliation

```text
6d54bc3bb76b00d78d0b18bca5f9eac4f9376f22
github workflow fix
```

Parent:

```text
14ec4da08b2f8ddda61c568a814b3f1c15a6ba83
```

Observed diff is root `pnpm-lock.yaml` only; CLI importer moves Puppeteer 21.11 -> 24.34 with dependency graph update.

Because root CI runs `pnpm install` and the package manifest had already moved to Puppeteer 24 while the root lock remained at 21, this supports the inference that workspace install state was being reconciled for CI.

It does not establish the exact failure message or prove a failed CI run without log evidence.

### Demo browser materialization

```text
83d74776dc9cb9b740b124b17c16fef0cab69c18
Install Chrome for demo PDF in CI
```

Observed diff:

```text
+ pnpm --filter @invoice-suite/cli-demo exec puppeteer browsers install chrome
```

immediately before demo PDF generation.

### Test browser materialization

```text
922ceb6ab93f548f33769d34da6cb803e8ce6813
Install Chrome for CLI tests in CI
```

Observed same Chrome-install operation immediately before `pnpm test`.

Current CLI smoke tests invoke PDF generation directly, making browser availability a real test dependency.

## Retrieval failures / weak routes

- empty-query commit search returned no commits;
- keyword commit search (`CI`, `fix`) recovered the repair chain;
- no GitHub Actions run/failure logs have been recovered through the current connector routes;
- no issue/PR/adjudication artifact has been recovered for the CI repair sequence;
- current README/CHANGELOG explain architecture/features but do not preserve this failure genealogy.

These retrieval limits are part of the archaeology result.

## Evidence ceiling

Current fourth-site evidence licenses:

```text
exact configuration/package/test transitions
current browser dependency
root/package-local lock divergence then reconciliation
current CI survivor
```

It does not license:

```text
exact failure messages
private motive
specific failed-run chronology
claim that every repair was reactive rather than proactive
claim that Puppeteer 24 was selected for one particular bug
```

## Ledger update rule

Add only traces consumed by bounded findings. Under sparse history, record missing evidence routes as carefully as recovered artifacts so a later runtime does not convert plausible explanations into historical fact.