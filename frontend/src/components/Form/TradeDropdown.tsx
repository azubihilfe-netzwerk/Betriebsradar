import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface TradeDropdownProps {
  trades: string[];
  trade: string | null;
  onSelect: (trade: string) => void;
  onClear?: () => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const TradeDropdown: FC<TradeDropdownProps> = ({
  trades,
  trade,
  onSelect,
  onClear,
  label,
  required,
  error,
  placeholder = 'Alle Gewerke',
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTrades = useMemo(() => {
    if (!search.trim()) return trades;
    const needle = search.trim().toLowerCase();
    return trades.filter((t) => t.toLowerCase().includes(needle));
  }, [trades, search]);

  const close = () => {
    setOpen(false);
    setSearch('');
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-brand-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
            if (e.key === 'Escape') close();
          }}
          className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-brand-input ${
            error ? 'border-standard-error' : 'border-standard'
          } text-base cursor-pointer`}
        >
          {trade ? (
            <span className="flex items-center gap-2 min-w-0">
              <span className="truncate">{trade}</span>
              {onClear && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  aria-label="Gewerk-Filter entfernen"
                  className="flex-shrink-0 p-0.5 hover:opacity-70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>

        {open && (
          <div className="absolute z-10 mt-2 w-full bg-brand-input border-standard shadow">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Gewerk suchen…"
              className="w-full px-4 py-3 bg-brand-input border-b border-gray-200 focus:outline-none text-base"
            />
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {filteredTrades.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(t);
                      close();
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      t === trade ? 'font-semibold' : ''
                    }`}
                  >
                    {t}
                  </button>
                </li>
              ))}
              {filteredTrades.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-600">
                  <i>Keine Treffer.</i>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="text-brand-error text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TradeDropdown;
