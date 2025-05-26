import { theme } from '@/config/theme';

interface ErrorStateProps {
  error: string;
  onLogout: () => void;
}

export const ErrorState = ({ error, onLogout }: ErrorStateProps) => {
  return (
    <div style={{backgroundColor: theme.background.secondary, color: theme.error.DEFAULT, borderColor: theme.error.DEFAULT}} 
      className="text-center py-10 px-6 rounded-lg border"
    >
      <h2 className="text-2xl font-semibold mb-3">Oops! Something went wrong.</h2>
      <p className="mb-6">{error}</p>
      <button
        onClick={onLogout}
        className="px-5 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
        style={{
          backgroundColor: theme.error.DEFAULT,
          color: '#ffffff'
        }}
      >
        Logout and Try Again
      </button>
    </div>
  );
}; 