'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Re-adding Link import
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useParams } from 'next/navigation';
import { theme } from '@/config/theme';
import { Nav } from '@/components/Nav';

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

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface EditState {
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
}

interface TaskState {
  addingTask: boolean;
  togglingTaskId: number | null;
  error: string | null;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskUser1, setNewTaskUser1] = useState('');
  const [newTaskUser2, setNewTaskUser2] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const [session, setSession] = useState<Session | null>(null);
  const { get, put, post, delete: deleteRequest } = useApi();
  const { id } = useParams();

  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    isLoading: false,
    error: null
  });
  const [editedName, setEditedName] = useState('');

  const [taskState, setTaskState] = useState<TaskState>({
    addingTask: false,
    togglingTaskId: null,
    error: null
  });

  // Determine if current user is user1 or user2 in the session
  const isUser1 = user && session && user.id === session.user1;
  const isUser2 = user && session && user.id === session.user2;
  const isSessionParticipant = isUser1 || isUser2;

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [get]);

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
    
    const newTask = userId === session?.user1 ? newTaskUser1 : newTaskUser2;
    
    if (!newTask.trim() || !session) return;

    setTaskState(prev => ({ ...prev, addingTask: true, error: null }));

    try {
      const createdTask = await post<Task>(
        ENDPOINTS.SESSIONS.TASKS.ADD.path(session.id), 
        { text: newTask, user_id: userId }
      );
      
      setTasks((prevTasks: Task[]) => [...prevTasks, createdTask]);
      
      if (userId === session.user1) {
        setNewTaskUser1('');
      } else {
        setNewTaskUser2('');
      }
    } catch (err) {
      console.error('Failed to add task', err);
      setTaskState(prev => ({ 
        ...prev, 
        error: 'Failed to add task. Please try again.' 
      }));
    } finally {
      setTaskState(prev => ({ ...prev, addingTask: false }));
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
  }, [get, id]);

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
    if (id) {
      fetchTasks();
      const intervalId = setInterval(fetchTasks, 5000);
      return () => clearInterval(intervalId);
    }
  }, [get, id]);

  // Function to toggle task done status
  const toggleTaskStatus = async (task: Task) => {
    setTaskState(prev => ({ ...prev, togglingTaskId: task.id, error: null }));

    try {
      const updatedTask = await put<Task>(
        ENDPOINTS.SESSIONS.TASKS.UPDATE.path(id as string, task.id.toString()), 
        { ...task, is_done: !task.is_done }
      );

      setTasks(prevTasks => prevTasks.map(t => 
        t.id === task.id ? updatedTask : t
      ));
    } catch (err) {
      console.error('Failed to update task status', err);
      setTaskState(prev => ({ 
        ...prev, 
        error: 'Failed to update task status. Please try again.' 
      }));
    } finally {
      setTaskState(prev => ({ ...prev, togglingTaskId: null }));
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

  const TaskItem = ({ task, isLast }: { task: Task; isLast: boolean }) => {
    const isMenuOpen = openMenuId === task.id;
    const isToggling = taskState.togglingTaskId === task.id;
    
    return (
      <>
        <div 
          className="p-2 rounded-lg transition-all duration-200 border-transparent"
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleTaskStatus(task)}
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
                  setOpenMenuId(isMenuOpen ? null : task.id);
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
                        deleteTask(task.id);
                        setOpenMenuId(null);
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
  };

  const handleEditSessionName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !editedName.trim()) return;

    setEditState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = await put<Session>(
        ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(session.id),
        { name: editedName.trim() }
      );
      setSession(updatedSession);
      setEditState(prev => ({ ...prev, isEditing: false }));
    } catch (err) {
      console.error('Failed to update session name:', err);
      setEditState(prev => ({ 
        ...prev, 
        error: 'Failed to update session name. Please try again.' 
      }));
    } finally {
      setEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="w-full sm:w-auto">
              {editState.isEditing ? (
                <form onSubmit={handleEditSessionName} className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-transparent border-b-2 focus:outline-none focus:border-blue-500 transition-colors duration-200 pb-1"
                    style={{
                      color: theme.typography.primary,
                      borderColor: theme.border
                    }}
                    autoFocus
                    disabled={editState.isLoading}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
                        ${!editState.isLoading && !editedName.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ 
                        backgroundColor: `${theme.brand.background}20`,
                        color: theme.brand.background
                      }}
                      disabled={editState.isLoading || !editedName.trim()}
                    >
                      {editState.isLoading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditState(prev => ({ ...prev, isEditing: false }));
                        setEditedName(session?.name || '');
                      }}
                      className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
                        ${!editState.isLoading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      style={{ 
                        backgroundColor: `${theme.error.DEFAULT}20`,
                        color: theme.error.DEFAULT
                      }}
                      disabled={editState.isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center sm:text-left">
                    {session ? session.name : 'Session Details'}
                  </h2>
                  {session && isSessionParticipant && (
                    <button
                      onClick={() => {
                        setEditedName(session.name);
                        setEditState(prev => ({ ...prev, isEditing: true }));
                      }}
                      className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
                      style={{ 
                        backgroundColor: `${theme.brand.background}20`,
                        color: theme.brand.background
                      }}
                      title="Edit session name"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {editState.error && (
                <p className="text-sm mt-1" style={{ color: theme.error.DEFAULT }}>
                  {editState.error}
                </p>
              )}
              {session && (
                <p className="text-gray-400 text-sm sm:text-base mt-1">
                  Session with {session.user1_username} and {session.user2_username}
                </p>
              )}
            </div>
            <Link 
              href="/"
              className="text-sm font-medium px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 mt-4 sm:mt-0 cursor-pointer"
              style={{
                backgroundColor: theme.background.secondary,
                color: theme.typography.primary,
                border: `1px solid ${theme.border}`
              }}
            >
              &larr; Back to Home
            </Link>
          </div>

          {(loading || userLoading) ? (
            <div className="text-white text-center py-10">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-10">{error}</div>
          ) : !session ? (
            <div className="text-white text-center py-10">No session found.</div>
          ) : !user ? (
            <div className="text-white text-center py-10">Please log in to view this session.</div>
          ) : !isSessionParticipant ? (
            <div className="text-white text-center py-10">You are not a participant in this session.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* User 1 Tasks */}
              <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: theme.brand.background}}></div>
                  <h3 className="text-2xl font-semibold text-white">
                    {isUser1 ? `You (${session.user1_username})` : `${session.user1_username}`}
                  </h3>
                </div>

                {/* Task Input Form - Only show in current user's column */}
                {isUser1 && (
                  <div className="mb-6">
                    <form 
                      onSubmit={(e) => handleTaskSubmit(e, session.user1)}
                      className='flex gap-2' 
                    >
                      <input 
                        type="text" 
                        value={newTaskUser1}
                        onChange={(e) => setNewTaskUser1(e.target.value)}
                        placeholder="Type to add a task..."
                        className='flex-1 px-4 py-2 rounded-lg text-base transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50' 
                        style={{
                          backgroundColor: theme.background.primary,
                          color: theme.typography.primary,
                          border: `1px solid ${theme.border}`
                        }}
                        disabled={taskState.addingTask}
                      />
                      <button 
                        type="submit" 
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          active:scale-95 ${!taskState.addingTask && !newTaskUser1.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}
                          flex items-center gap-2`}
                        style={{
                          backgroundColor: theme.brand.background,
                          color: theme.brand.text
                        }}
                        disabled={!newTaskUser1.trim() || taskState.addingTask}
                      >
                        {taskState.addingTask ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Adding...
                          </>
                        ) : (
                          'Add Task'
                        )}
                      </button>
                    </form>
                    {taskState.error && (
                      <p className="text-sm mt-2" style={{ color: theme.error.DEFAULT }}>
                        {taskState.error}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
                      Active Tasks
                    </h4>
                    <div className="space-y-2">
                      {user1Tasks.filter(task => !task.is_done).length > 0 ? (
                        user1Tasks.filter(task => !task.is_done).map((task, index, array) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            isLast={index === array.length - 1}
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
                      {user1Tasks.filter(task => task.is_done).length > 0 ? (
                        user1Tasks.filter(task => task.is_done).map(task => (
                          <TaskItem key={task.id} task={task} isLast={false} />
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

              {/* User 2 Tasks */}
              <div className="p-6 rounded-lg shadow-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: theme.brand.background}}></div>
                  <h3 className="text-2xl font-semibold text-white">
                    {isUser2 ? `You (${session.user2_username})` : `${session.user2_username}`}
                  </h3>
                </div>

                {/* Task Input Form - Only show in current user's column */}
                {isUser2 && (
                  <div className="mb-6">
                    <form 
                      onSubmit={(e) => handleTaskSubmit(e, session.user2)}
                      className='flex gap-2' 
                    >
                      <input 
                        type="text" 
                        value={newTaskUser2}
                        onChange={(e) => setNewTaskUser2(e.target.value)}
                        placeholder="Type to add a task..."
                        className='flex-1 px-4 py-2 rounded-lg text-base transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50' 
                        style={{
                          backgroundColor: theme.background.primary,
                          color: theme.typography.primary,
                          border: `1px solid ${theme.border}`
                        }}
                      />
                      <button 
                        type="submit" 
                        className='px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                          flex items-center gap-2' 
                        style={{
                          backgroundColor: theme.brand.background,
                          color: theme.brand.text
                        }}
                        disabled={!newTaskUser2.trim()}
                      >
                        Add Task
                      </button>
                    </form>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: theme.brand.background}}></span>
                      Active Tasks
                    </h4>
                    <div className="space-y-2">
                      {user2Tasks.filter(task => !task.is_done).length > 0 ? (
                        user2Tasks.filter(task => !task.is_done).map(task => (
                          <TaskItem key={task.id} task={task} isLast={false} />
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
                      {user2Tasks.filter(task => task.is_done).length > 0 ? (
                        user2Tasks.filter(task => task.is_done).map(task => (
                          <TaskItem key={task.id} task={task} isLast={false} />
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
