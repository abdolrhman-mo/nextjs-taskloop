import { Task } from '@/types/session';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskItem } from './TaskItem';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  togglingTaskId: number | null;
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  togglingTaskId,
}: TaskColumnProps) {
  const { theme } = useTheme();
  // Sort tasks by created_at in descending order (latest first)
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const activeTasks = sortedTasks.filter(task => !task.is_done);
  const completedTasks = sortedTasks.filter(task => task.is_done);

  return (
    <div className="rounded-lg shadow-lg overflow-hidden h-fit" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
      {/* Header section with user name */}
      <div className="p-4" style={{backgroundColor: `${theme.brand.background}10`}}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 rounded-full" style={{backgroundColor: theme.brand.background}}></div>
          <h3 className="text-2xl font-semibold" style={{color: theme.typography.primary}}>{title}</h3>
        </div>
      </div>

      {/* Task lists section */}
      <div className="p-6 space-y-6 min-h-0">
        <div>
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2" style={{color: theme.typography.primary}}>
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
            Todo
            <span className="text-sm px-2 py-0.5 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.brand.background
            }}>
              {activeTasks.length}
            </span>
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
              <p className="italic text-center py-4 bg-opacity-50 rounded-lg" style={{
                backgroundColor: theme.background.primary,
                color: theme.typography.secondary
              }}>
                No tasks
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: theme.border}}>
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2" style={{color: theme.typography.primary}}>
            <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
            Done
            <span className="text-sm px-2 py-0.5 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.brand.background
            }}>
              {completedTasks.length}
            </span>
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
              <p className="italic text-center py-4 bg-opacity-50 rounded-lg" style={{
                backgroundColor: theme.background.primary,
                color: theme.typography.secondary
              }}>
                No tasks done
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 