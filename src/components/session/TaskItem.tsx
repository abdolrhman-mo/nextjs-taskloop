import { useState } from 'react';
import { theme } from '@/config/theme';
import { Task } from '@/types/session';

interface TaskItemProps {
  task: Task;
  isLast: boolean;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  isToggling: boolean;
}

export function TaskItem({ task, isLast, onToggle, onDelete, isToggling }: TaskItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="p-2 rounded-lg transition-all duration-200 border-transparent">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggle(task)}
            className={`flex-shrink-0 focus:outline-none group ${!isToggling ? 'cursor-pointer' : ''}`}
            disabled={isToggling}
          >
            <div className={`
              w-5 h-5 rounded border-2 flex items-center justify-center
              transition-colors duration-200
              ${!isToggling ? 'cursor-pointer' : ''}
              ${task.is_done 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-400 group-hover:border-gray-300'
              }
              ${isToggling ? 'opacity-50' : ''}
            `}>
              {isToggling ? (
                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : task.is_done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
          
          <span className={`flex-grow text-white ${task.is_done ? 'line-through text-gray-400' : ''} ${isToggling ? 'opacity-50' : ''}`}>
            {task.text}
          </span>
          
          <div className="flex-shrink-0 relative task-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 rounded-md hover:bg-gray-600 transition-colors duration-200
                text-gray-300 hover:text-gray-100 cursor-pointer"
              title="Task options"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300
                      flex items-center gap-2 cursor-pointer"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!isLast && (
        <div 
          className="h-px my-2 opacity-20" 
          style={{ backgroundColor: theme.border }}
        />
      )}
    </>
  );
} 