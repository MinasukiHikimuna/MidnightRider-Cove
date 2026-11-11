// Types for extensions.mjs, which astro.config.mjs also imports and so stays plain JavaScript.

export interface FeatureGuideSection {
  id: string;
  title: string;
  // Checked by scripts/feature-guides/check-feature-guides.mjs; FeatureGuideBlock.astro types each block.
  blocks: any[];
}

export interface FeatureGuide {
  schemaVersion: 1;
  id: string;
  title: string;
  description: string;
  order: number;
  parentTopicId?: string;
  sections: FeatureGuideSection[];
}

export interface CollectedExtension {
  slug: string;
  id: string;
  name: string;
  description: string;
  version: string;
  minCoveVersion: string | null;
  tag: string | null;
  readmeUrl: string;
  developerTool: boolean;
  guides: FeatureGuide[];
}

export function loadExtensions(): CollectedExtension[];
export function guideTree(guides: FeatureGuide[]): { guide: FeatureGuide; children: FeatureGuide[] }[];
export function extensionPath(extension: CollectedExtension): string;
export function guidePath(extension: CollectedExtension, guide: FeatureGuide): string;
