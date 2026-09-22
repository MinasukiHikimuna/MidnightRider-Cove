# Dependency: AI Core must deliver asset-scope results for video

Segment Studio is meant to get shot boundaries through Cove's native **Run AI**
dialog, by publishing an `IAiCapabilityContributor`. A contributor only ever
sees an `AiAnalyzeResult` — `AiDispatchRequest` carries no raw payload — so
whatever the AI server returns has to survive `AiAnalyzeResultParser`.

It does not in any released AI Core, up to and including **0.6.0**. The parser
is media-kind specific:

| `mediaKind` | reads | ignores |
|---|---|---|
| `image` | `analysis` → `AssetAnalysis` | |
| `audio` | `windows` | |
| `video` | `frames` **only** | `analysis`, `windows` |

`ParseVideo` simply never picked up an asset-level `analysis`, because until now
nothing produced one for a video, so `AssetAnalysis` is always `null` for video.

## The fix

Proposed upstream as
[skier233/AI.Extensions#2](https://github.com/skier233/AI.Extensions/pull/2):
`ParseVideo` reads `analysis` exactly as `ParseImage` does, with parser tests and
a tagging regression test. It changes no public type, signature, extension
version, or Cove floor; the release that carries it is the maintainer's call.

Boundaries arrive as `AssetAnalysis.Other["shot_boundaries"]`, a JSON string —
`ParseAnalysisNode` already stringifies nested values in the `other` block, and
entries without a `vector` are not mistaken for embeddings. The contributor
parses it with `JsonDocument`.

## Sequencing

A Segment Studio release that carries the Run AI contributor and drops
`services/segment-studio-analysis` must wait until that change ships in an AI
Core release, otherwise the Run AI checkbox would appear and silently produce
nothing. That Segment Studio release must also declare a dependency on
`cove.community.ai.core` requiring the first release after 0.6.0 that includes
the PR; its manifest declares no AI Core dependency today.

The AI server side does not depend on it: emitting an asset-level `analysis`
node mirrors the image pipeline and is correct regardless.

## Audit: is the parser line the only AI Core change needed?

Yes. Everything else in AI Core is already capability-agnostic:

| Concern | Finding |
|---|---|
| Claim / feature selection | Driven by contributor descriptors; no allowlist of capability ids |
| Want resolution | Generic fallback filters the catalog on `WantCapability` + `WantScope` |
| Want serialisation | Sends `capability`, `scope` and explicit `models`; all handled server-side |
| Dispatch | `MaybeDispatchAsync` does not gate on frame count, so `frames: []` still dispatches |
| `DispatchResultsByDefault` | Defaults to `true` |
| Run AI dialog | `modelMatchesClaim` matches capability + scope generically |
| Model catalog | `AiModelCatalogEntry` already carries `Capabilities` / `SupportedScopes`; snake_case deserialisation |
| `AiCapabilityClaim.OutputKey` | Declared but never read anywhere — descriptive only |
| Special-casing | Only `"tagging"`, and only inside its own model-resolution branch |
| `AiArtifactReplaceService` | Not capability-specific |

### Operational notes (not AI Core code changes)

- The checkbox only appears when a matching model is **active** in the server's
  `active_ai.yaml` (`featureHasActiveServingModels` → `active === true`). The
  operator loads the model through AI Core's catalog UI first. This is the
  desired behaviour, not a defect.
- Declaring an `AiModelBindingSlot` on the feature is optional. Without one the
  generic catalog filter selects the model; with one the UI gains a model
  picker. Worth adding if more than one shot-boundary model is ever available.
- **Version alignment matters for Segment Studio.** The host loads exactly one
  copy of `AI.Extensions.Abstractions` for the entire process, chosen by file
  mtime, then size, then path (`ExtensionManager.PreloadSharedAssemblies`).
  Mismatched copies do not coexist: whichever file is newest wins for every
  extension. Segment Studio bundles its own copy too, so it must ship the same
  build the installed AI Core does — otherwise it can silently replace AI Core's
  abstractions for the whole process.
