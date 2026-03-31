// Warm design system — adapted from Qafilah
// Single light theme. No dark mode.

export const lightTheme = {
  brand: {
    text: '#ffffff',
    background: '#b45309', // Warm amber
    hover: '#92400e',
  },
  typography: {
    primary: '#292116', // Warm dark
    secondary: '#6b5e4b', // Warm muted
  },
  background: {
    primary: '#faf8f5', // Warm ivory
    secondary: '#fdfcfa',
    tertiary: '#f0ebe3',
    fourth: '#e5ddd0',
    todo_task: '#fff7e6',
    done_task: '#f0faf0',
  },
  border: '#e5ddd0',
  hover: '#f5efe6',
  error: {
    DEFAULT: '#dc2626',
    text: '#ffffff',
  },
};

export type Theme = typeof lightTheme;

export const theme = lightTheme;
