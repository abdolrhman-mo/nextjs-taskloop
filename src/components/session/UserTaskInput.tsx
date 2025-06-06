import { useTheme } from '@/contexts/ThemeContext';
import { TaskInput } from './TaskInput';

interface UserTaskInputProps {
  userId: number;
  onSubmit: (text: string, userId: number) => Promise<void>;
  isAdding: boolean;
  error: string | null;
  isFullWidth?: boolean;
}

export function UserTaskInput({ 
  userId, 
  onSubmit, 
  isAdding, 
  error,
  isFullWidth = true 
}: UserTaskInputProps) {
  const { theme } = useTheme();

  return (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''} my-2`}>
      <div className="max-w-2xl">
        <div 
          className="rounded-lg transition-colors duration-200 p-4" 
          style={{
            backgroundColor: `${theme.brand.background}10`,
            border: `1px solid ${theme.border}`
          }}
        >
          <h3 
            className="text-xl font-bold pb-2"
            style={{color: theme.typography.primary}}
          >
            Add to your todo
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