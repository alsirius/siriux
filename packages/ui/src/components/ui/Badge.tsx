import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300'
  }[variant];

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
