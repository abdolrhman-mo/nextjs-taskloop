import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types/session';
import {
  CheckCircleIcon,
  CircleIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => Promise<void>;
  onDelete?: (taskId: number) => Promise<void>;
  onEdit?: (taskId: number, newText: string) => Promise<void>;
  isToggling: boolean;
  isColumnOwner: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onEdit, isToggling, isColumnOwner }: TaskItemProps) {
  const { theme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const editBoxRef = useRef<HTMLDivElement>(null);

  // Click-away listener to cancel editing
  useEffect(() => {
    if (!isEditing) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        editBoxRef.current &&
        !editBoxRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        setEditText(task.text);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, task.text]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete?.(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || editText === task.text) {
      setIsEditing(false);
      setEditText(task.text);
      return;
    }

    setIsSaving(true);
    try {
      await onEdit?.(task.id, editText.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit task:', error);
      setEditText(task.text);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.text);
    }
  };

  const isChecked = task.is_done;

  return (
    <>
      <div 
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          (isDeleting || isSaving) ? 'opacity-50' : ''
        } ${
          // Add extra padding for non-column owners instead of trash icon padding
          !isColumnOwner ? 'py-3' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {/* Custom Checkbox using Lucide icons */}
          <button
            onClick={() => isColumnOwner && onToggle?.(task)}
            disabled={isToggling || isDeleting || isEditing || !isColumnOwner}
            className={`flex-shrink-0 focus:outline-none ${isColumnOwner ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {isChecked ? (
              <CheckCircleIcon className="text-green-500 w-4 h-4" />
            ) : (
              <CircleIcon className="text-amber-500 w-4 h-4" />
            )}
          </button>
          
          {/* Edit input */}
          {isEditing ? (
            <div ref={editBoxRef} className="flex-grow flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: theme.background.secondary,
                  color: theme.typography.primary,
                  borderColor: theme.border
                }}
                disabled={isSaving}
                autoFocus
              />
              <button
                onClick={handleEdit}
                disabled={isSaving || !editText.trim() || editText === task.text}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                  ${(isSaving || !editText.trim() || editText === task.text) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:opacity-90 cursor-pointer'}`}
                style={{
                  backgroundColor: theme.brand.background,
                  color: theme.brand.text
                }}
              >
                {isSaving ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          ) : (
            <>
              <span 
                className={`flex-grow ${task.is_done ? 'line-through' : ''} ${(isToggling || isDeleting || isSaving) ? 'opacity-50' : ''}`} 
                style={{
                  color: task.is_done ? theme.typography.secondary : theme.typography.primary
                }}
              >
                {task.text}
              </span>
              {isColumnOwner && !isEditing && (
                <div className="flex items-center gap-1">
                  <div 
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ease-in-out ${
                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-600 hover:text-indigo-600 cursor-pointer"
                      title="Edit task"
                      disabled={isDeleting || isSaving}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div 
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ease-in-out ${
                      isHovered ? 'opacity-100 translate-x-0' : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={handleDelete}
                      className="p-1 text-gray-600 hover:text-red-600 cursor-pointer"
                      title="Delete task"
                      disabled={isDeleting || isSaving}
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
