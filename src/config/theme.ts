// Theme configuration for consistent color palette


// Light theme (default)
export const lightTheme = {
  brand: {
    text: '#ffffff',
    background: '#269DD9',
    hover: '#6d28d9', // Violet-700
  },
  typography: {
    primary: '#334155', // Slate-700
    secondary: '#94a3b8', // Slate-400
  },
  background: {
    primary: '#fff', // Slate-100
    secondary: '#ffffff', // White
    tertiary: '#e2e8f0', // Slate-200
    fourth: '#cad5e2', // Slate-400
    todo_task: '#fff7e6', // Amber-50
    done_task: '#e6fff7', // Slate-50
  },
  border: '#e2e8f0', // Slate-200
  hover: '#F7F3FE', // Light Violet
  error: {
    DEFAULT: '#dc2626', // Red-600
    text: '#ffffff'
  }
};

export const darkTheme = {
  brand: {
    text: '#ffffff',
    background: '#269DD9',
    hover: '#7c3aed', // Violet-600
  },
  typography: {
    primary: '#f1f5f9', // Slate-50
    secondary: '#94a3b8', // Slate-400
  },
  background: {
    primary: '#0f172a', // Slate-900
    secondary: '#1e293b', // Slate-800
    tertiary: '#334155', // Slate-700
    fourth: '#45556c', // Slate-600
    todo_task: '#0f172a', // Slate-900
    done_task: '#0f172a', // Slate-900
  },
  border: '#334155', // Slate-700
  hover: '#252C46',
  error: {
    DEFAULT: '#ef4444', // Red-500
    text: '#ffffff'
  }
};

export type Theme = typeof lightTheme;

// For backward compatibility
export const theme = lightTheme;
