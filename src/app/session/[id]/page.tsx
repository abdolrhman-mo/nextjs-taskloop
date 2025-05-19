'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useParams } from 'next/navigation';
import { theme } from '@/config/theme';
import { Nav } from '@/components/Nav';
import { SessionHeader } from '@/components/session/SessionHeader';
import { TaskColumn } from '@/components/session/TaskColumn';
import { Session, Task, User } from '@/types/session';
import { TaskInput } from '@/components/session/TaskInput';

export default function Page() {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [taskState, setTaskState] = useState({
    addingTask: false,
    togglingTaskId: null as number | null,
    error: null as string | null,
    isAddingTask: false
  });

  // API and routing hooks
  const { get, put, post, delete: deleteRequest } = useApi();
  const { id } = useParams();

  // Session participant checks
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

  // Fetch session data
  useEffect(() => {
    const fetchSession = async (isInitialLoad: boolean = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        const sessionResponse = await get<Session>(ENDPOINTS.SESSIONS.READ.path(id as string));
        setSession(sessionResponse);
      } catch (err) {
        console.error(err);
        setError('Failed to load session');
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    if (id) {
      // Initial load with loading state
      fetchSession(true);
      // Periodic updates without loading state
      const intervalId = setInterval(() => fetchSession(false), 5000);
      return () => clearInterval(intervalId);
    }
  }, [get, id]);

  // Periodic task updates
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse = await get<Task[]>(ENDPOINTS.SESSIONS.TASKS.LIST.path(id as string));
        setTasks(tasksResponse);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };

    if (id) {
      fetchTasks();
      const intervalId = setInterval(fetchTasks, 5000);
      return () => clearInterval(intervalId);
    }
  }, [get, id]);

  // Task management handlers
  const handleAddTask = async (text: string, userId: number) => {
    if (!session) return;

    setTaskState(prev => ({ ...prev, addingTask: true, error: null }));

    try {
      const createdTask = await post<Task>(
        ENDPOINTS.SESSIONS.TASKS.ADD.path(session.id), 
        { text, user_id: userId }
      );
      setTasks(prevTasks => [...prevTasks, createdTask]);
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

  const handleToggleTask = async (task: Task) => {
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

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteRequest(ENDPOINTS.SESSIONS.TASKS.DELETE.path(id as string, taskId.toString()));
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  // Task filtering
  const user1Tasks = tasks.filter(task => task.user === session?.user1);
  const user2Tasks = tasks.filter(task => task.user === session?.user2);

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            {session && isSessionParticipant && (
              <SessionHeader
                session={session}
                isSessionParticipant={isSessionParticipant}
                onSessionUpdate={setSession}
              />
            )}
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
              {isUser1 && (
                <div className="md:col-span-2 mb-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-medium text-white">
                        Add to {session.user1_username}&apos;s tasks
                      </h3>
                    </div>
                    <div className="p-4 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
                      <TaskInput
                        onSubmit={(text) => handleAddTask(text, session.user1)}
                        isAdding={taskState.isAddingTask}
                        error={taskState.error}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isUser2 && (
                <div className="md:col-span-2 mb-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="p-4 py-6 rounded-lg" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}}>
                      <h3 className="text-lg font-medium text-white pb-2">
                        Add to {session.user2_username}&apos;s tasks
                      </h3>
                      <TaskInput
                        onSubmit={(text) => handleAddTask(text, session.user2)}
                        isAdding={taskState.isAddingTask}
                        error={taskState.error}
                      />
                    </div>
                  </div>
                </div>
              )}

              <TaskColumn
                title={isUser1 ? `${session.user1_username} (you)` : session.user1_username}
                tasks={user1Tasks}
                isColumnOwner={isUser1 ?? false}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                togglingTaskId={taskState.togglingTaskId}
              />

              <TaskColumn
                title={isUser2 ? `${session.user2_username} (you)` : session.user2_username}
                tasks={user2Tasks}
                isColumnOwner={isUser2 ?? false}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                togglingTaskId={taskState.togglingTaskId}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
