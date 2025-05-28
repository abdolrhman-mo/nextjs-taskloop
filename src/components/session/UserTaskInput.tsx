import { useTheme } from '@/contexts/ThemeContext';
import { TaskInput } from './TaskInput';

interface UserTaskInputProps {
  username: string;
  userId: number;
  onSubmit: (text: string, userId: number) => Promise<void>;
  isAdding: boolean;
  error: string | null;
  isFullWidth?: boolean;
}

export function UserTaskInput({ 
  username, 
  userId, 
  onSubmit, 
  isAdding, 
  error,
  isFullWidth = true 
}: UserTaskInputProps) {
  const { theme } = useTheme();

  return (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} my-2`}>
      <div className="max-w-2xl mx-auto">
        <div 
          className="p-4 py-6 rounded-lg transition-colors duration-200" 
          style={{
            backgroundColor: theme.background.secondary, 
            border: `1px solid ${theme.border}`
          }}
        >
          <h3 
            className="text-lg font-medium pb-2" 
            style={{color: theme.typography.primary}}
          >
            Add to {username}&apos;s tasks
          </h3>
          <TaskInput
            onSubmit={(text) => onSubmit(text, userId)}
            isAdding={isAdding}
            error={error}
          />
        </div>
      </div>
    </div>
  );
} 