import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../utils/cn';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  onClick?: () => void;
  fallbackToCustom?: boolean; // Try custom SVG if lucide icon not found
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className = '', 
  onClick,
  fallbackToCustom = true
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const sizeValue = typeof size === 'number' ? size : 
    size === 'xs' ? 16 : 
    size === 'sm' ? 20 : 
    size === 'md' ? 24 : 
    size === 'lg' ? 32 : 
    size === 'xl' ? 40 : 24;

  const sizeClass = typeof size === 'number' ? '' : sizeClasses[size];

  // Try Lucide icon first (convert kebab-case to PascalCase)
  const lucideIconName = name.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');

  const LucideIcon = (LucideIcons as any)[lucideIconName];

  // If Lucide icon exists and is a component, use it
  if (LucideIcon && typeof LucideIcon === 'function') {
    return (
      <LucideIcon 
        size={sizeValue} 
        className={cn(
          'inline-flex shrink-0',
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={onClick}
      />
    );
  }

  // Fallback to custom SVG if enabled
  if (fallbackToCustom) {
    return (
      <img
        src={`/icons/${name}.svg`}
        alt={name}
        className={cn(
          sizeClass,
          'inline-flex shrink-0',
          onClick && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={onClick}
        style={typeof size === 'number' ? { width: sizeValue, height: sizeValue } : {}}
      />
    );
  }

  // Final fallback - placeholder
  return (
    <div 
      className={cn(
        sizeClass,
        'inline-flex shrink-0 bg-gray-200 rounded',
        className
      )}
      style={typeof size === 'number' ? { width: sizeValue, height: sizeValue } : {}}
    />
  );
};

export default Icon;
