'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useParams } from 'next/navigation';
import { theme } from '@/config/theme';

interface Session {
  id: string;
  name: string;
  user1: number;
  user2: number;
  user1_username: string;
  user2_username: string;
  created_at: string;
}

interface Task {
  id: number;
  session: number;
  user: number;
  text: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskUser1, setNewTaskUser1] = useState('');
  const [newTaskUser2, setNewTaskUser2] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const { get, put, post, delete: deleteRequest } = useApi();
  const { id } = useParams();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null && !(event.target as Element).closest('.task-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleTaskSubmit = async (e: React.FormEvent, userId: number) => {
    e.preventDefault();
    
    // Determine which task input to use based on userId
    const newTask = userId === session?.user1 ? newTaskUser1 : newTaskUser2;
    
    if (!newTask.trim() || !session) return;

    try {
      const createdTask = await post<Task>(
        ENDPOINTS.SESSIONS.TASKS.ADD.path(session.id), 
        { text: newTask, user_id: userId }
      );
      
      // Update local state
      setTasks((prevTasks: Task[]) => [...prevTasks, createdTask]);
      
      // Clear the appropriate input
      if (userId === session.user1) {
        setNewTaskUser1('');
      } else {
        setNewTaskUser2('');
      }
    } catch (err) {
      console.error('Failed to add task', err);
      // Optionally set an error state
    }
  };

  // Fetch session only once on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionResponse = await get<Session>(ENDPOINTS.SESSIONS.READ.path(id as string));
        setSession(sessionResponse);
      } catch (err) {
        console.error(err);
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  // Fetch tasks periodically
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await get<Task[]>(ENDPOINTS.SESSIONS.TASKS.LIST.path(id as string));
        setTasks(tasksResponse);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    // Initial fetch
    fetchTasks();

    // Set up interval to fetch tasks every 5 seconds
    const intervalId = setInterval(fetchTasks, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [id]);

  // Function to toggle task done status
  const toggleTaskStatus = async (task: Task) => {
    try {
      // Update task status on the server
      const updatedTask = await put<Task>(
        ENDPOINTS.SESSIONS.TASKS.UPDATE.path(id as string, task.id.toString()), 
        { ...task, is_done: !task.is_done }
      );

      // Update local state
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === task.id ? updatedTask : t
      ));
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  // Separate tasks for user1 and user2
  const user1Tasks = tasks.filter(task => task.user === session?.user1);
  const user2Tasks = tasks.filter(task => task.user === session?.user2);

  const deleteTask = async (taskId: number) => {
    try {
      await deleteRequest(ENDPOINTS.SESSIONS.TASKS.DELETE.path(id as string, taskId.toString()));
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const isMenuOpen = openMenuId === task.id;
    
    return (
      <div 
        className="bg-gray-700 p-4 rounded-lg transition-all duration-200 
          hover:shadow-lg border border-transparent hover:border-gray-600"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleTaskStatus(task)}
            className="flex-shrink-0 focus:outline-none group"
          >
            <div className={`
              w-5 h-5 rounded border-2 flex items-center justify-center
              transition-colors duration-200
              ${task.is_done 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-400 group-hover:border-gray-300'
              }
            `}>
              {task.is_done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
          
          <span className={`flex-grow text-white ${task.is_done ? 'line-through text-gray-400' : ''}`}>
            {task.text}
          </span>
          
          <div className="flex-shrink-0 relative task-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(isMenuOpen ? null : task.id);
              }}
              className="p-1 rounded-md hover:bg-gray-600 transition-colors duration-200
                text-gray-300 hover:text-gray-100"
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
                      deleteTask(task.id);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300
                      flex items-center gap-2"
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
    );
  };

  return (
    <div className="min-h-screen p-8" style={{backgroundColor: theme.background.primary}}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">TaskLoop</h1>
          <Link href="/" className="text-white">Back to Home</Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">{session?.name}</h2>

        {loading ? (
          <div className="text-white text-center">Loading tasks...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : session == null ? (
          <div className="text-white text-center">No session found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User 1 Tasks */}
            <div className="bg-gray-800 p-6 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
              <h2 className="text-2xl font-semibold text-white mb-6">{session?.user1_username}</h2>
              <form 
                onSubmit={(e) => handleTaskSubmit(e, session?.user1 as number)}
                className='mb-6 flex gap-2' 
              >
                <input 
                  type="text" 
                  value={newTaskUser1}
                  onChange={(e) => setNewTaskUser1(e.target.value)}
                  placeholder="Add a new task..."
                  className='block rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  style={{backgroundColor: theme.background.primary, color: theme.typography.primary, borderColor: theme.border}}
                />
                <button 
                  type="submit" 
                  className='px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-all duration-200' 
                  style={{backgroundColor: theme.brand.background, color: theme.brand.text}}
                >
                  Add Task
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">Active Tasks</h3>
                {user1Tasks.filter(task => !task.is_done).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {user1Tasks.filter(task => !task.is_done).length === 0 && (
                  <p className="text-gray-400 italic text-center py-4">No active tasks</p>
                )}

                <h3 className="text-lg font-semibold text-white mt-6 mb-3">Completed Tasks</h3>
                {user1Tasks.filter(task => task.is_done).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {user1Tasks.filter(task => task.is_done).length === 0 && (
                  <p className="text-gray-400 italic text-center py-4">No completed tasks</p>
                )}
              </div>
            </div>

            {/* User 2 Tasks */}
            <div className="bg-gray-800 p-6 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
              <h2 className="text-2xl font-semibold text-white mb-6">{session?.user2_username}</h2>
              <form 
                onSubmit={(e) => handleTaskSubmit(e, session?.user2 as number)}
                className='mb-6 flex gap-2' 
              >
                <input 
                  type="text" 
                  value={newTaskUser2}
                  onChange={(e) => setNewTaskUser2(e.target.value)}
                  placeholder="Add a new task..."
                  className='block rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500' 
                  style={{backgroundColor: theme.background.primary, color: theme.typography.primary, borderColor: theme.border}}
                />
                <button 
                  type="submit" 
                  className='px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-all duration-200' 
                  style={{backgroundColor: theme.brand.background, color: theme.brand.text}}
                >
                  Add Task
                </button>
              </form>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">Active Tasks</h3>
                {user2Tasks.filter(task => !task.is_done).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {user2Tasks.filter(task => !task.is_done).length === 0 && (
                  <p className="text-gray-400 italic text-center py-4">No active tasks</p>
                )}

                <h3 className="text-lg font-semibold text-white mt-6 mb-3">Completed Tasks</h3>
                {user2Tasks.filter(task => task.is_done).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {user2Tasks.filter(task => task.is_done).length === 0 && (
                  <p className="text-gray-400 italic text-center py-4">No completed tasks</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
