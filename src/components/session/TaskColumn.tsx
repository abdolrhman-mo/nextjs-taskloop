import { Task } from '@/types/session';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskItem } from './TaskItem';
import { CheckCircleIcon, CircleIcon, Trophy, Archive } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  isColumnOwner: boolean;
  onToggleTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onEditTask: (taskId: number, newText: string) => Promise<void>;
  onArchiveDone?: (completedTasks: Task[]) => void;
  togglingTaskId: number | null;
  position?: number;
  completionPercentage?: number;
  themeColor?: string;
}

export function TaskColumn({
  title,
  tasks,
  isColumnOwner,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onArchiveDone,
  togglingTaskId,
  position,
  completionPercentage,
  themeColor
}: TaskColumnProps) {
  const { theme } = useTheme();
  // Sort tasks by created_at in descending order (latest first)
  // const sortedTasks = [...tasks].sort((a, b) => 
  //   new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  // );
  const sortedTasks = tasks;
  
  const activeTasks = sortedTasks.filter(task => !task.is_done);
  const completedTasks = sortedTasks.filter(task => task.is_done);

  const getPositionColor = (pos: number) => {
    switch (pos) {
      case 1: return 'text-yellow-500'; // Gold
      case 2: return 'text-gray-400';   // Silver
      case 3: return 'text-amber-700';  // Bronze
      default: return 'text-gray-500';  // Default
    }
  };

  const getPositionText = (pos: number) => {
    switch (pos) {
      case 1: return '1st';
      case 2: return '2nd';
      case 3: return '3rd';
      default: return `${pos}th`;
    }
  };

  return (
    <div className="rounded-lg shadow- mdoverflow-hidden h-fit" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
      {/* Header section with user name and position */}
      <div className="p-4" style={{backgroundColor: themeColor ? `${themeColor}10` : `${theme.brand.background}10`}}>
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            {position && position <= 3 && (
              <Trophy className={`w-5 h-5 ${getPositionColor(position)}`} />
            )}
            <h3 className="text-xl font-semibold" style={{color: theme.typography.primary}}>
              {position ? `${getPositionText(position)} ${title}` : title}
            </h3>
          </div>
          {completionPercentage !== undefined && (
            <div className="text-sm font-medium px-2 py-1 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.typography.primary
            }}>
              {completionPercentage.toFixed(0)}% done
            </div>
          )}
        </div>
      </div>

      {/* Task lists section */}
      <div className="p-4 space-y-3 min-h-0">
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{color: theme.typography.secondary}}>
            <CircleIcon className="text-amber-500 w-3.5 h-3.5" />
            To Do
            {/* <span className="text-sm px-2 py-0.5 rounded-full" style={{
              backgroundColor: `${theme.brand.background}20`,
              color: theme.typography.primary
            }}>
              {activeTasks.length}
            </span> */}
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
              <p className="italic text-center py-2 text-xs bg-opacity-50 rounded-md" style={{
                backgroundColor: theme.background.primary,
                color: theme.typography.secondary
              }}>
                No tasks
              </p>
            )}
          </div>
        </div>

        {completedTasks.length > 0 && (
        <div className="pt-3 border-t" style={{borderColor: theme.border}}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold flex items-center gap-2" style={{color: theme.typography.secondary}}>
              <CheckCircleIcon className="text-green-500 w-3.5 h-3.5" />
              Done
            </h4>
            {isColumnOwner && onArchiveDone && completedTasks.length > 0 && (
              <button
                onClick={() => onArchiveDone(completedTasks)}
                className="cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-opacity hover:opacity-70"
                style={{ color: theme.typography.secondary, border: `1px solid ${theme.border}` }}
              >
                <Archive className="w-3 h-3" />
                Archive
              </button>
            )}
          </div>
          <div>
              {completedTasks.map((task) => (
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
              ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
} 