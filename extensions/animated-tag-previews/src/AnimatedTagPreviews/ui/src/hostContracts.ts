import type { FC, ReactNode } from "react";

export type EntityMediaSurface = "card" | "hero" | "list" | "picker" | "recommendation" | "dialog" | "hover";
export type EntityMediaFit = "cover" | "contain";

export interface EntityMediaRenderProps {
  entityType: string;
  entityId: number;
  surface: EntityMediaSurface;
  imageUrl?: string | null;
  alt: string;
  fit: EntityMediaFit;
  loading?: "eager" | "lazy";
  className?: string;
  renderDefault: () => ReactNode;
}

export interface ExtensionModule {
  components?: Record<string, FC<any>>;
  onLoad?: () => void | Promise<void>;
  onUnload?: () => void | Promise<void>;
}

export interface EntityCoverEditorContext {
  entityType: string;
  entityId: number;
  coverKey: "primary" | "front" | "back";
  currentImageUrl?: string | null;
  canEdit: boolean;
}
