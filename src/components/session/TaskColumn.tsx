import { Task } from '@/types/session';
import { theme } from '@/config/theme';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onAddTask: (text: string) => Promise<void>;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  isAddingTask: boolean | null;
  togglingTaskId: number | null;
  error: string | null;
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isAddingTask,
  togglingTaskId,
  error
}: TaskColumnProps) {
  const activeTasks = tasks.filter(task => !task.is_done);
  const completedTasks = tasks.filter(task => task.is_done);

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-8 rounded-full" style={{backgroundColor: theme.brand.background}}></div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>

      {isColumnOwner && (
        <TaskInput
          onSubmit={onAddTask}
          isAdding={isAddingTask ?? false}
          error={error}
        />
      )}

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
            Active Tasks
          </h4>
          <div className="space-y-2">
            {activeTasks.length > 0 ? (
              activeTasks.map((task, index, array) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isLast={index === array.length - 1}
                  onToggle={isColumnOwner ? onToggleTask : undefined}
                  onDelete={isColumnOwner ? onDeleteTask : undefined}
                  isToggling={togglingTaskId === task.id}
                  isColumnOwner={isColumnOwner}
                />
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-4 bg-opacity-50 rounded-lg" style={{backgroundColor: theme.background.primary}}>
                No active tasks
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: theme.border}}>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
            Completed Tasks
          </h4>
          <div className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index, array) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isLast={index === array.length - 1}
                  onToggle={isColumnOwner ? onToggleTask : undefined}
                  onDelete={isColumnOwner ? onDeleteTask : undefined}
                  isToggling={togglingTaskId === task.id}
                  isColumnOwner={isColumnOwner}
                />
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-4 bg-opacity-50 rounded-lg" style={{backgroundColor: theme.background.primary}}>
                No completed tasks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 