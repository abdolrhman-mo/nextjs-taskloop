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
    secondary: '#45556c', // Slate-400
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
  hover: '#D6EDF8',
  error: {
    DEFAULT: '#dc2626', // Red-600
    text: '#ffffff'
  }
};

export const darkTheme = {
  brand: {
    text: '#FFFFFF',
    background: '#269DD9',
    hover: '#2dd4bf',       // Teal-400 for interactive hover
  },
  typography: {
    primary: '#ECECEC', // Light gray text
    secondary: '#A1A1AA', // Muted gray (like ChatGPT sidebar/help text)
  },
  background: {
    primary: '#1E1E20', // Main background (ChatGPT’s conversation area)
    secondary: '#2A2B2E', // Sidebar / panel background
    tertiary: '#3A3B3F',  // Cards or containers
    fourth: '#4B4C50',    // Optional deeper layer
    todo_task: '#2C2A23', // Subtle difference, same as secondary
    done_task: '#1F2A26', // Slight green tint for completed items
  },
  border: '#3F3F46', // Neutral gray for dividers
  hover: '#3C3C44', // Subtle dark hover
  error: {
    DEFAULT: '#EF4444', // Red-500
    text: '#ffffff'
  }
};


export type Theme = typeof lightTheme;

// For backward compatibility
export const theme = lightTheme;
