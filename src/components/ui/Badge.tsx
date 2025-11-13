import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'yellow' | 'grey' | 'both' | 'success' | 'warning' | 'info';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    yellow: 'bg-yellow-bin text-gray-900',
    grey: 'bg-grey-bin text-white',
    both: 'bg-orange-500 text-white',
    success: 'bg-alert-success text-white',
    warning: 'bg-alert-warning text-white',
    info: 'bg-alert-info text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
