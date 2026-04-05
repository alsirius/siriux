// Core exports
export * from './contexts/AuthContext';
export * from './components';
export * from './icons';
export * from './utils';

// Re-export commonly used items
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { LoginForm } from './components/auth';
export { Icon } from './components';

// Version information
export const SIRIUX_UI_VERSION = '1.0.0';
