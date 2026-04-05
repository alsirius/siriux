// Icon mappings for commonly used custom icons
// These will fallback to custom SVGs when lucide icons aren't available

export const CUSTOM_ICONS = {
  // Custom brand icons
  'alsirius-logo': 'alsirius-logo',
  'alsirius-logo-icon': 'alsirius-logo-icon',
  'alsirius-logo-icon-26': 'alsirius-logo-icon-26',
  'alsirius-logo-icon-black-2025': 'alsirius-logo-icon-black-2025',
  'alsirius-logo-icon-white-2025': 'alsirius-logo-icon-white-2025',
  'alsirius-logo-transparent-2025': 'alsirius-logo-transparent-2025',
  'alsirius-logo-white-2025': 'alsirius-logo-white-2025',
  
  // Custom feature icons that have unique designs
  'shield': 'shield', // Custom security shield
  'shield_a': 'shield_a', // Security variant A
  'shield_b': 'shield_b', // Security variant B
  'chart-bar': 'chart-bar', // Custom chart design
  'users': 'users', // Custom users icon
  'file-text': 'file-text', // Custom document icon
  'chat-bar': 'chat-bar', // Custom chat icon
} as const;

// Helper function to check if an icon is custom
export function isCustomIcon(name: string): boolean {
  return name in CUSTOM_ICONS;
}

// Export commonly used lucide icon names for type safety
export const LUCIDE_ICONS = {
  // Navigation
  'menu': 'Menu',
  'x': 'X',
  'chevron-down': 'ChevronDown',
  'chevron-up': 'ChevronUp',
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight',
  
  // Actions
  'plus': 'Plus',
  'minus': 'Minus',
  'edit': 'Edit',
  'trash': 'Trash',
  'search': 'Search',
  'filter': 'Filter',
  'download': 'Download',
  'upload': 'Upload',
  
  // User & Auth
  'user': 'User',
  'users': 'Users',
  'user-plus': 'UserPlus',
  'user-minus': 'UserMinus',
  'log-in': 'LogIn',
  'log-out': 'LogOut',
  'key': 'Key',
  'shield': 'Shield',
  'lock': 'Lock',
  'unlock': 'Unlock',
  
  // Communication
  'mail': 'Mail',
  'phone': 'Phone',
  'message-circle': 'MessageCircle',
  'send': 'Send',
  'bell': 'Bell',
  
  // Business & Analytics
  'bar-chart': 'BarChart',
  'line-chart': 'LineChart',
  'pie-chart': 'PieChart',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
  'target': 'Target',
  'zap': 'Zap',
  'star': 'Star',
  'heart': 'Heart',
  
  // Files & Documents
  'file': 'File',
  'file-text': 'FileText',
  'folder': 'Folder',
  'folder-open': 'FolderOpen',
  'archive': 'Archive',
  'save': 'Save',
  'copy': 'Copy',
  'clipboard': 'Clipboard',
  
  // Settings & Tools
  'settings': 'Settings',
  'cog': 'Cog',
  'wrench': 'Wrench',
  'tool': 'Tool',
  'sliders': 'Sliders',
  
  // Media
  'image': 'Image',
  'video': 'Video',
  'music': 'Music',
  'camera': 'Camera',
  'mic': 'Mic',
  'volume-2': 'Volume2',
  'volume-x': 'VolumeX',
  
  // Status & Feedback
  'check': 'Check',
  'check-circle': 'CheckCircle',
  'x-circle': 'XCircle',
  'alert-circle': 'AlertCircle',
  'alert-triangle': 'AlertTriangle',
  'info': 'Info',
  'help-circle': 'HelpCircle',
  
  // Time & Date
  'calendar': 'Calendar',
  'clock': 'Clock',
  'timer': 'Timer',
  'watch': 'Watch',
  
  // Social
  'github': 'Github',
  'twitter': 'Twitter',
  'facebook': 'Facebook',
  'instagram': 'Instagram',
  'linkedin': 'Linkedin',
  'youtube': 'Youtube',
} as const;
