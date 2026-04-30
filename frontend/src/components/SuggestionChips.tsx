import React from "react";

interface SuggestionChipsProps {
  chips: string[];
  onSelect: (chip: string) => void;
  chipClassName: string;
}

export default function SuggestionChips({ chips, onSelect, chipClassName }: SuggestionChipsProps): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-3">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${chipClassName}`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
