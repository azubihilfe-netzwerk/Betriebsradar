import React, { FC, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface TradeFilterDropdownProps {
  trades: string[];
  trade: string | null;
  onSelect: (trade: string) => void;
  onClear: () => void;
}

const TradeFilterDropdown: FC<TradeFilterDropdownProps> = ({ trades, trade, onSelect, onClear }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
        }}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-brand-input border-standard text-base cursor-pointer"
      >
        {trade ? (
          <span className="flex items-center gap-2 min-w-0">
            <span className="truncate">{trade}</span>
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
          </span>
        ) : (
          <span className="text-gray-500">Alle Gewerke</span>
        )}
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <ul className="absolute z-10 mt-2 w-full max-h-64 overflow-y-auto bg-brand-input border-standard shadow divide-y divide-gray-100">
          {trades.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => {
                  onSelect(t);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  t === trade ? 'font-semibold' : ''
                }`}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TradeFilterDropdown;
