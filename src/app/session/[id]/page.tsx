'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Nav } from '@/components/Nav';
import { SessionHeader } from '@/components/session/SessionHeader';
import { TaskColumn } from '@/components/session/TaskColumn';
import { Session, Task, User } from '@/types/session';
import { UserTaskInput } from '@/components/session/UserTaskInput';
import { BackButton } from '@/components/common/BackButton';

export default function Page() {
  const { theme } = useTheme();
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
  // const isCreator = user && session && user.id === session.creator;
  const isParticipant = user && session && session.participants.some(p => p.id === user.id);
  const currentParticipant = user && session ? session.participants.find(p => p.id === user.id) : null;
  const otherParticipants = session ? session.participants.filter(p => p.id !== user?.id) : [];
      
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
        ENDPOINTS.SESSIONS.TASKS.ADD.path(session.uuid), 
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

  // Task filtering by participant
  const participantTasks = (participantId: number) => 
    tasks.filter(task => task.user === participantId);

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BackButton href="/" className="mt-4 sm:mt-0" />
            {session && isParticipant && (
              <SessionHeader
                session={session}
                isSessionParticipant={isParticipant}
                onSessionUpdate={setSession}
              />
            )}
          </div>

          {(loading || userLoading) ? (
            <div className="text-center py-10" style={{color: theme.typography.primary}}>Loading...</div>
          ) : error ? (
            <div className="text-center py-10" style={{color: theme.error.DEFAULT}}>{error}</div>
          ) : !session ? (
            <div className="text-center py-10" style={{color: theme.typography.primary}}>No session found.</div>
          ) : !user ? (
            <div className="text-center py-10" style={{color: theme.typography.primary}}>Please log in to view this session.</div>
          ) : !isParticipant ? (
            <div className="text-center py-10" style={{color: theme.typography.primary}}>You are not a participant in this session.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {currentParticipant && (
                <UserTaskInput
                  username={currentParticipant.username}
                  userId={currentParticipant.id}
                  onSubmit={handleAddTask}
                  isAdding={taskState.isAddingTask}
                  error={taskState.error}
                />
              )}

              {currentParticipant && (
                <TaskColumn
                  title={`${currentParticipant.username} (you)`}
                  tasks={participantTasks(currentParticipant.id)}
                  isColumnOwner={true}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  togglingTaskId={taskState.togglingTaskId}
                />
              )}

              {otherParticipants.map(participant => (
                <TaskColumn
                  key={participant.id}
                  title={participant.username}
                  tasks={participantTasks(participant.id)}
                  isColumnOwner={false}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  togglingTaskId={taskState.togglingTaskId}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
