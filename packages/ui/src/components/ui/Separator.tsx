import React from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const baseClasses = 'border-gray-200 dark:border-gray-700';
  const orientationClasses = {
    horizontal: 'border-t w-full',
    vertical: 'border-l h-full'
  }[orientation];

  const classes = `${baseClasses} ${orientationClasses} ${className}`;

  return (
    <div className={classes} role="separator" {...props} />
  );
};
