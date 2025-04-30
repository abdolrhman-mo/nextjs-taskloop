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

interface TaskRequest {
  text: string;
  user_id: number;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskUser1, setNewTaskUser1] = useState('');
  const [newTaskUser2, setNewTaskUser2] = useState('');

  const [session, setSession] = useState<Session | null>(null);
  const { get, put, post } = useApi();
  const { id } = useParams();

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

  return (
    <div className="min-h-screen p-8" style={{backgroundColor: theme.background.primary}}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">TaskLoop</h1>
          <Link href="/" className="text-white">Back to Home</Link>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">{session?.name}</h2>

        {loading ? (
          <div className="text-white text-center">Loading sessions...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : session == null ? (
          <div className="text-white text-center">No session found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User 1 Tasks */}
            <div className="bg-gray-800 p-4 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
              <h2 className="text-2xl font-semibold text-white mb-4">{session.user1_username}</h2>
              <form 
                onSubmit={(e) => handleTaskSubmit(e, session.user1)}
                className='p-4 rounded-lg mb-4 flex justify-between items-center' style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}
              >
                <input 
                  type="text" 
                  value={newTaskUser1}
                  onChange={(e) => setNewTaskUser1(e.target.value)}
                  placeholder="Enter a new task"
                  className='block rounded p-2 w-3/4 focus:outline-none' style={{backgroundColor: theme.background.primary, color: theme.typography.primary, borderColor: theme.border}}
                />
                <button type="submit" className='px-4 py-2 rounded cursor-pointer hover:opacity-90' style={{backgroundColor: theme.brand.background, color: theme.brand.text}}>
                  Add Task
                </button>
              </form>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tasks</h3>
                  <div className="space-y-2">
                    {user1Tasks.filter(task => !task.is_done).length > 0 ? (
                      user1Tasks.filter(task => !task.is_done).map(task => (
                        <div key={task.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                          <span className="text-white flex-grow">{task.text}</span>
                          <button 
                            onClick={() => toggleTaskStatus(task)}
                            className="ml-2 focus:outline-none cursor-pointer"
                          >
                            <span 
                              className="
                                w-5 h-5 border-2 rounded 
                                border-gray-400 inline-block
                              "
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-center py-4">No active tasks yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Done</h3>
                  <div className="space-y-2">
                    {user1Tasks.filter(task => task.is_done).length > 0 ? (
                      user1Tasks.filter(task => task.is_done).map(task => (
                        <div key={task.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                          <span className="line-through flex-grow">{task.text}</span>
                          <button 
                            onClick={() => toggleTaskStatus(task)}
                            className="ml-2 focus:outline-none cursor-pointer"
                          >
                            <span 
                              className="
                                w-5 h-5 border-2 rounded 
                                bg-green-500 border-green-500 inline-block
                                flex items-center justify-center
                              "
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 text-white" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-center py-4">No completed tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User 2 Tasks */}
            <div className="bg-gray-800 p-4 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
              <h2 className="text-2xl font-semibold text-white mb-4">{session.user2_username}</h2>
              <form 
                onSubmit={(e) => handleTaskSubmit(e, session.user2)}
                className='p-4 rounded-lg mb-4 flex justify-between items-center' style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}
              >
                <input 
                  type="text" 
                  value={newTaskUser2}
                  onChange={(e) => setNewTaskUser2(e.target.value)}
                  placeholder="Enter a new task"
                  className='block rounded p-2 w-3/4 focus:outline-none' style={{backgroundColor: theme.background.primary, color: theme.typography.primary, borderColor: theme.border}} 
                />
                <button type="submit" className='px-4 py-2 rounded cursor-pointer hover:opacity-90' style={{backgroundColor: theme.brand.background, color: theme.brand.text}}>
                  Add Task
                </button>
              </form>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tasks</h3>
                  <div className="space-y-2">
                    {user2Tasks.filter(task => !task.is_done).length > 0 ? (
                      user2Tasks.filter(task => !task.is_done).map(task => (
                        <div key={task.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                          <span className="text-white flex-grow">{task.text}</span>
                          <button 
                            onClick={() => toggleTaskStatus(task)}
                            className="ml-2 focus:outline-none cursor-pointer"
                          >
                            <span 
                              className="
                                w-5 h-5 border-2 rounded 
                                border-gray-400 inline-block
                              "
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-center py-4">No active tasks yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Done</h3>
                  <div className="space-y-2">
                    {user2Tasks.filter(task => task.is_done).length > 0 ? (
                      user2Tasks.filter(task => task.is_done).map(task => (
                        <div key={task.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                          <span className="line-through flex-grow">{task.text}</span>
                          <button 
                            onClick={() => toggleTaskStatus(task)}
                            className="ml-2 focus:outline-none cursor-pointer"
                          >
                            <span 
                              className="
                                w-5 h-5 border-2 rounded 
                                bg-green-500 border-green-500 inline-block
                                flex items-center justify-center
                              "
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 text-white" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-center py-4">No completed tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
