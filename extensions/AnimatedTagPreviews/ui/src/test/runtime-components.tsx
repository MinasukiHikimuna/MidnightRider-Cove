export function EntityReferenceSelector({ value, onChange, disabled }: { value?: number; onChange(value?: number): void; disabled?: boolean }) {
  return <label>Tag ID<input aria-label="Tag ID" type="number" value={value ?? ""} disabled={disabled} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)} /></label>;
}
