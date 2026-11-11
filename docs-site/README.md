# MidnightRider extensions documentation site

The site at https://minasukihikimuna.github.io/MidnightRider-Cove/ documents every released MidnightRider extension. Its pages are built only from the extensions' own files: each extension's `extension.json` and the feature guides it lists under `featureGuides`. These are the same guides Cove's in-app User Guide shows. Nothing on the site is written by hand.

## How a guide gets onto the site

1. Write the guide as a feature-guide JSON file in the extension's `docs/` folder, in the format of Cove's `docs/feature-guides/schema.json`. `extensions/hash-the-cove/src/HashTheCove/docs/guides/hash-the-cove.json` is a complete example. Put screenshots in `docs/images/` and refer to them relative to the guide file. Screenshots must show only the extension's own controls, with no library content or entity names.
2. List the file under `featureGuides` in the extension's `extension.json`, and set `"docs": "src/<Project>/docs"` in its `release.json`, so the release copies the folder into the package as `docs/`. The site reads the same two things the package has: the manifest and that folder.
3. Have the extension's package validator check the guide by importing `scripts/feature-guides/check-feature-guides.mjs`, as Hash The Cove's validator does.
4. Open a pull request. The Documentation Site workflow builds the site from the pull request's files and fails on any problem: a block Cove would drop, a guide id Cove keeps for its own topics, a missing image, or a link within the site that leads nowhere. It also collects from the release tags, as a deploy would, so a change that breaks an already released guide fails before merging.
5. Release the extension as usual. After the release build succeeds, the site is rebuilt from the newest published release of each extension, so the guide appears together with the release that ships it. A change to the site itself is deployed when it is merged, and the workflow can also be run by hand from the Actions tab.

A guide can sit under another of the extension's guides with `parentTopicId`. The site nests them two levels deep, the same way Cove's User Guide nests one extension's guides. A guide whose parent is one of Cove's own topics, such as `extensions`, is listed at the top of its extension on the site, because Cove's topics are not part of it. In Cove it sits under that topic, and its child guides sit beside it.

An extension with no guide yet gets a short page made from its `extension.json`, which links to its README. An extension with no release is not listed at all.

## Developer tools

Extensions listed in `developerTools` in `site.config.json` appear in a separate Developer tools group. They are for developing and troubleshooting Cove, not features for everyday use.

## Working on the site

```sh
cd docs-site
npm ci
npm test         # the shared guide checks, guide nesting and the output checks
npm run dev      # collects from the working tree, then serves the site
npm run collect  # collects from the newest release tags; a deploy also skips tags without a published release
npm run build    # type-checks, builds dist/, and checks every link and image within the site
```

`npm run collect` and `npm run dev` write `.generated/extensions.json` and copy guide images into `public/extensions/`. Neither is committed. Run `node scripts/collect.mjs --working-tree --renderer-fixture` before `npm run build` to add the renderer fixture page, which the output check verifies the same way pull requests do.

## Keeping in step with Cove

`src/components/guides/` is adapted from Cove's documentation site, and `scripts/feature-guides/fixtures/extension-guide-blocks.json` is a pinned copy of Cove's list of the blocks its User Guide renders, and `reserved-topic-ids.json` next to it lists the topic ids Cove keeps for itself. Each file names the Cove commit it came from. When Cove changes how guides render, copy the new fixture from `ui/src/test/fixtures/extension-guide-blocks.json` in yourcove/cove, regenerate the reserved ids from its `docs/feature-guides/*.json` ids and `legacyTopicAliases`, update the commits they name, and run `npm test` and the fixture build. Any block Cove now renders differently then fails a test.
