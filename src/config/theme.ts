// Theme configuration using CSS variables

export const theme = {
  brand: {
    text: 'var(--brand-text)',
    background: 'var(--brand-background)',
    hover: 'var(--brand-hover)',
  },
  typography: {
    primary: 'var(--typography-primary)',
    secondary: 'var(--typography-secondary)',
  },
  background: {
    primary: 'var(--background-primary)',
    secondary: 'var(--background-secondary)',
    tertiary: 'var(--background-tertiary)',
  },
  border: 'var(--border)',
  hover: 'var(--hover)',
  error: {
    DEFAULT: 'var(--error)',
    text: 'var(--error-text)'
  }
};
