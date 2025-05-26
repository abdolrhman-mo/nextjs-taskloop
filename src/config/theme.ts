// Theme configuration for consistent color palette

// Dark theme (commented out)

// export const theme = {
//   brand: {
//     text: '#000',
//     background: '#fff',
//     hover: '#5b51d8',
//   },
//   typography: {
//     primary: '#fff',
//     secondary: '#B3B3B3',
//   },
//   background: {
//     primary: '#191A1A',
//     secondary: '#202222',
//     tertiary: '#434343',
//   },
//   border: '#4C4C4C',
//   hover: '#fff',
//   error: {
//     DEFAULT: '#ef4444',
//     text: '#ffffff'
//   }
// };


// Light theme (default)
export const lightTheme = {
  brand: {
    text: '#ffffff',
    background: '#7c3aed', // Violet-600
    hover: '#6d28d9', // Violet-700
  },
  typography: {
    primary: '#334155', // Slate-700
    secondary: '#94a3b8', // Slate-400
  },
  background: {
    primary: '#f1f5f9', // Slate-100
    secondary: '#ffffff', // White
    tertiary: '#e2e8f0', // Slate-200
  },
  border: '#e2e8f0', // Slate-200
  hover: '#7c3aed', // Violet-600
  error: {
    DEFAULT: '#dc2626', // Red-600
    text: '#ffffff'
  }
};

export const darkTheme = {
  brand: {
    text: '#ffffff',
    background: '#8b5cf6', // Violet-500
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
  },
  border: '#334155', // Slate-700
  hover: '#8b5cf6', // Violet-500
  error: {
    DEFAULT: '#ef4444', // Red-500
    text: '#ffffff'
  }
};

export type Theme = typeof lightTheme;

// For backward compatibility
export const theme = lightTheme;
