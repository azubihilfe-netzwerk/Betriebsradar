import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CollapsibleProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ header, children, className = '', defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`card-standard ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        {header}
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-blackish transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-black/10 p-4 pt-3">{children}</div>}
    </div>
  );
};

export default Collapsible;
