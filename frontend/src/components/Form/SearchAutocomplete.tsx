import React from 'react';

export interface SearchAutocompleteProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getSubtitle?: (item: T) => string | null | undefined;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (item: T) => void;
  placeholder: string;
  emptyMessage?: string;
  autoFocus?: boolean;
  className?: string;
}

function SearchAutocomplete<T>({
  items,
  getKey,
  getLabel,
  getSubtitle,
  search,
  onSearchChange,
  onSelect,
  placeholder,
  emptyMessage = 'Keine Treffer.',
  autoFocus,
  className = '',
}: SearchAutocompleteProps<T>) {
  return (
    <div className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 bg-brand-input border-standard
          focus:border-brand-button-hover focus:outline-none text-base"
        autoFocus={autoFocus}
      />

      {search.length > 0 && items.length > 0 && (
        <ul className="bg-brand-input border-standard shadow divide-y divide-gray-100 mt-2">
          {items.map((item) => (
            <li key={getKey(item)}>
              <button
                type="button"
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => onSelect(item)}
              >
                <span className="font-medium text-gray-900">{getLabel(item)}</span>
                {getSubtitle?.(item) && (
                  <span className="text-sm text-gray-500 ml-2">{getSubtitle(item)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {search.length > 0 && items.length === 0 && (
        <p className="mt-2"><i>{emptyMessage}</i></p>
      )}
    </div>
  );
}

export default SearchAutocomplete;
