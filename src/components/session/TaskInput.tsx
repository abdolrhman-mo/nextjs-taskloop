import { useState } from 'react';
import { theme } from '@/config/theme';

interface TaskInputProps {
  onSubmit: (text: string) => Promise<void>;
  isAdding: boolean | null;
  error: string | null;
}

export function TaskInput({ onSubmit, isAdding, error }: TaskInputProps) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || isAddingTask) return;

    try {
      await onSubmit(newTask.trim());
      setNewTask('');
    } catch {
      // Error is handled by parent component
    }
  };

  const isAddingTask = isAdding ?? false;

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Type to add a task..."
          className={`flex-1 px-4 py-2 rounded-lg text-base transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            ${isAddingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: theme.background.primary,
            color: theme.typography.primary,
            border: `1px solid ${theme.border}`
          }}
          disabled={isAddingTask}
        />
        <button 
          type="submit" 
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            active:scale-95 ${(!isAddingTask && !newTask.trim()) || isAddingTask ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            flex items-center gap-2`}
          style={{
            backgroundColor: theme.brand.background,
            color: theme.brand.text
          }}
          disabled={!newTask.trim() || isAddingTask}
        >
          {isAddingTask ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding Task...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </form>
      {error && (
        <p className="text-sm mt-2" style={{ color: theme.error.DEFAULT }}>
          {error}
        </p>
      )}
    </div>
  );
} 