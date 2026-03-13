"use client";

interface SearchInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
}

export function SearchInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: SearchInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={ariaLabel}
        className="search-input"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 font-bold text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
}
