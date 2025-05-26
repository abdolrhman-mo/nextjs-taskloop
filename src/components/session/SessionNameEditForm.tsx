import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SessionNameEditFormProps {
  initialName: string;
  isLoading: boolean;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function SessionNameEditForm({ 
  initialName, 
  isLoading, 
  onSubmit, 
  onCancel 
}: SessionNameEditFormProps) {
  const { theme } = useTheme();
  const [editedName, setEditedName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;
    onSubmit(editedName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-1">
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-transparent border-b-2 focus:outline-none focus:border-blue-500 transition-colors duration-200 pb-1"
        style={{
          color: theme.typography.primary,
          borderColor: theme.border
        }}
        autoFocus
        disabled={isLoading}
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
            ${!isLoading && !editedName.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ 
            backgroundColor: `${theme.brand.background}20`,
            color: theme.brand.background
          }}
          disabled={isLoading || !editedName.trim()}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
            ${!isLoading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          style={{ 
            backgroundColor: `${theme.error.DEFAULT}20`,
            color: theme.error.DEFAULT
          }}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>
  );
} 