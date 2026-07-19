import { useRef, useState } from "react";

interface EntityReferenceOption { id: number; label: string; secondaryLabel?: string }

function optionFor(searchText: string): EntityReferenceOption {
  return searchText.toLowerCase().includes("replacement")
    ? { id: 88, label: "Tag 88" }
    : { id: 77, label: "Tag 77" };
}

export function EntityReferenceSelector({ value, onChange, disabled, selectedDisplay, selectedLabel }: {
  value?: number;
  onChange(value?: number, option?: EntityReferenceOption): void;
  disabled?: boolean;
  selectedDisplay?: "chip" | "input";
  selectedLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [activeOption, setActiveOption] = useState(false);
  const selectedInputLabel = value == null ? "" : selectedLabel ?? `Tag ${value}`;
  const showSelectedLabel = selectedDisplay === "input" && value != null && searchText === "";
  const option = optionFor(searchText);

  const selectOption = () => {
    if (!searchText) return;
    onChange(option.id, option);
    setSearchText("");
    setActiveOption(false);
    inputRef.current?.focus();
  };

  return <div>
    <label htmlFor="runtime-tag-selector">Tag ID</label>
    <input
      ref={inputRef}
      id="runtime-tag-selector"
      aria-label="Tag ID"
      role="combobox"
      type="text"
      value={showSelectedLabel ? selectedInputLabel : searchText}
      disabled={disabled}
      data-selected-display={selectedDisplay}
      aria-expanded={searchText !== ""}
      aria-controls={searchText ? "runtime-tag-options" : undefined}
      onChange={(event) => {
        setSearchText(event.target.value);
        setActiveOption(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" && searchText) {
          event.preventDefault();
          setActiveOption(true);
        }
        if (event.key === "Enter" && searchText) {
          event.preventDefault();
          selectOption();
        }
      }}
    />
    {selectedDisplay === "input" && value != null ? <button
      type="button"
      aria-label="Clear selected tag"
      disabled={disabled}
      onClick={() => {
        setSearchText("");
        setActiveOption(false);
        onChange(undefined);
        inputRef.current?.focus();
      }}
    >Clear</button> : null}
    {searchText ? <div id="runtime-tag-options" role="listbox">
      <button
        type="button"
        role="option"
        aria-selected={activeOption}
        onClick={selectOption}
      >{option.label}</button>
    </div> : null}
  </div>;
}
