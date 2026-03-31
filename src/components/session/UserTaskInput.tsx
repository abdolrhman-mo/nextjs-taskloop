import { TaskInput } from './TaskInput';

interface UserTaskInputProps {
  userId: number;
  onSubmit: (text: string, userId: number) => Promise<void>;
  isAdding: boolean;
  error: string | null;
  isFullWidth?: boolean;
  themeColor?: string;
}

export function UserTaskInput({
  userId,
  onSubmit,
  isAdding,
  error,
  isFullWidth = true,
  themeColor
}: UserTaskInputProps) {
  return (
    <div className={`${isFullWidth ? 'md:col-span-2' : ''}`}>
      <TaskInput
        onSubmit={(text) => onSubmit(text, userId)}
        isAdding={isAdding}
        error={error}
        themeColor={themeColor}
      />
    </div>
  );
}
