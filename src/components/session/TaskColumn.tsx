import { Task } from '@/types/session';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskItem } from './TaskItem';
import { CheckCircleIcon, CircleIcon } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onEditTask: (taskId: number, newText: string) => Promise<void>;
  togglingTaskId: number | null;
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  onEditTask,
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
    <div className="rounded-lg shadow- mdoverflow-hidden h-fit" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
      {/* Header section with user name */}
      <div className="p-4" style={{backgroundColor: `${theme.brand.background}10`}}>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold" style={{color: theme.typography.primary}}>{title}</h3>
        </div>
      </div>

      {/* Task lists section */}
      <div className="p-6 space-y-4 min-h-0">
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{color: theme.typography.primary}}>
            <CircleIcon className="text-amber-500 w-4 h-4" />
            To Do
            <span className="text-sm px-2 py-0.5 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.brand.background
            }}>
              {activeTasks.length}
            </span>
          </h4>
          <div>
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg mb-1"
                  style={{ backgroundColor: theme.background.todo_task }}
                >
                  <TaskItem
                    task={task}
                    onToggle={isColumnOwner ? onToggleTask : undefined}
                    onDelete={isColumnOwner ? onDeleteTask : undefined}
                    onEdit={isColumnOwner ? onEditTask : undefined}
                    isToggling={togglingTaskId === task.id}
                    isColumnOwner={isColumnOwner}
                  />
                </div>
              ))
            ) : (
              <p className="italic text-center py-3 bg-opacity-50 rounded-lg" style={{
                backgroundColor: theme.background.primary,
                color: theme.typography.secondary
              }}>
                No tasks
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t" style={{borderColor: theme.border}}>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{color: theme.typography.primary}}>
            <CheckCircleIcon className="text-green-500 w-4 h-4" />
            Done
            <span className="text-sm px-2 py-0.5 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.brand.background
            }}>
              {completedTasks.length}
            </span>
          </h4>
          <div>
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg mb-1"
                  style={{ backgroundColor: theme.background.done_task }}
                >
                  <TaskItem
                    task={task}
                    onToggle={isColumnOwner ? onToggleTask : undefined}
                    onDelete={isColumnOwner ? onDeleteTask : undefined}
                    onEdit={isColumnOwner ? onEditTask : undefined}
                    isToggling={togglingTaskId === task.id}
                    isColumnOwner={isColumnOwner}
                  />
                </div>
              ))
            ) : (
              <p className="italic text-center py-3 bg-opacity-50 rounded-lg" style={{
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