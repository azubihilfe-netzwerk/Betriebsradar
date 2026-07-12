import React from 'react';

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHeading: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold ${className}`}>{children}</h1>
);

export const SectionHeading: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-bold  ${className}`}>{children}</h2>
);

export const Paragraph: React.FC<HeadingProps> = ({ children, className = '' }) => (
  <p className={` ${className}`}>{children}</p>
);
