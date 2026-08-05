declare const apiFaultBundle: {
  components: Record<string, never>;
  onLoad(): void;
  onUnload(): void;
};

export interface ApiFaultPresetState {
  apiFaultMode: string;
  apiRequestFilter: string;
  includeSystemHealth: boolean;
  healthFaultExpiresAt: number;
}

export declare function applyUnavailablePreset(state: ApiFaultPresetState, now?: number): void;

export default apiFaultBundle;
