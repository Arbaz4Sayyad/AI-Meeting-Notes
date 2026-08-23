import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`bg-white dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436] rounded-lg shadow-2xs ${
        hover ? 'transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${paddings[padding] || paddings.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
