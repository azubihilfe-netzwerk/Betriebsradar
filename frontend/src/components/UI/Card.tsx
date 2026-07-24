import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a left accent border in the brand color */
  accent?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', accent = false }) => {
  return (
    <div
      className={`card-standard p-6 ${
        accent ? 'border-l-4 border-brand' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
