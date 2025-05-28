'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Nav } from '@/components/Nav';
import { SessionHeader } from '@/components/session/SessionHeader';
import { TaskColumn } from '@/components/session/TaskColumn';
import { Session, Task, User } from '@/types/session';
import { UserTaskInput } from '@/components/session/UserTaskInput';
import { BackButton } from '@/components/common/BackButton';
import { ShareSessionMenu } from '@/components/session/ShareSessionMenu';
import { SettingsMenu } from '@/components/session/SettingsMenu';
import { ShareRoomCTA } from '@/components/session/ShareRoomCTA';

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
  const [taskSortOrder, setTaskSortOrder] = useState<'newest' | 'oldest'>('newest');

  // API and routing hooks
  const { get, put, post, delete: deleteRequest } = useApi();
  const { id } = useParams();
  const router = useRouter();

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

  const handleEditTask = async (taskId: number, newText: string) => {
    try {
      const updatedTask = await put<Task>(
        ENDPOINTS.SESSIONS.TASKS.UPDATE.path(id as string, taskId.toString()), 
        { text: newText }
      );
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId ? updatedTask : t
      ));
    } catch (err) {
      console.error('Failed to update task', err);
      setTaskState(prev => ({ 
        ...prev, 
        error: 'Failed to update task. Please try again.' 
      }));
    }
  };

  // Sort tasks based on current sort order
  const getSortedTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return taskSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  };

  // Update participantTasks to use sorted tasks
  const participantTasks = (participantId: number) => 
    getSortedTasks(tasks.filter(task => task.user === participantId));

  const handleLeaveSession = async () => {
    if (!session) return;
    
    try {
      await post(ENDPOINTS.SESSIONS.LEAVE.path(session.uuid));
      router.push('/');
    } catch (err) {
      console.error('Failed to leave study room:', err);
      setError('Failed to leave study room. Please try again.');
    }
  };

  const handleDeleteSession = async () => {
    if (!session) return;
    
    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(session.uuid));
      router.push('/');
    } catch (err) {
      console.error('Failed to delete study room:', err);
      setError('Failed to delete study room. Please try again.');
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav>
        {session && isParticipant && (
            <SessionHeader
              session={session}
              onSessionUpdate={setSession}
            />
        )}
      </Nav>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Top row with all controls - responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Back button - always visible */}
              <div className="w-full sm:w-auto">
                <BackButton href="/" />
              </div>
            </div>

            {(loading || userLoading) ? (
              <div className="text-center py-10" style={{color: theme.typography.primary}}>Loading...</div>
            ) : error ? (
              <div className="text-center py-10" style={{color: theme.error.DEFAULT}}>{error}</div>
            ) : !session ? (
              <div className="text-center py-10" style={{color: theme.typography.primary}}>No study room found.</div>
            ) : !user ? (
              <div className="text-center py-10" style={{color: theme.typography.primary}}>Please log in to view this study room.</div>
            ) : !isParticipant ? (
              <div className="text-center py-10" style={{color: theme.typography.primary}}>You are not a participant in this study room.</div>
            ) : (
              <div className="flex flex-col gap-6 lg:gap-6">
                {/* Task input - responsive width */}
                {currentParticipant && session && isParticipant && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <UserTaskInput
                      userId={currentParticipant.id}
                      onSubmit={handleAddTask}
                      isAdding={taskState.isAddingTask}
                      error={taskState.error}
                      isFullWidth={false}
                    />

                    {/* Settings and Share buttons - responsive alignment */}
                    {session && isParticipant && (
                      <div className="w-full sm:w-auto flex items-center justify-end gap-2">
                        <SettingsMenu
                          sessionId={session.uuid} 
                          session={session}
                          isCreator={user && session.creator === user.id}
                          isParticipant={isParticipant}
                          onSessionUpdate={setSession}
                          onSessionLeave={handleLeaveSession}
                          onSessionDelete={handleDeleteSession}
                          taskSortOrder={taskSortOrder}
                          onTaskSortChange={setTaskSortOrder}
                        />
                        <ShareSessionMenu sessionId={session.uuid} />
                      </div>
                    )}
                  </div>
                )}
                {/* Task columns using CSS columns */}
                <div className="columns-1 md:columns-2 gap-6 lg:gap-8 [column-fill:_balance]">
                  {/* Current user's task column */}
                  {currentParticipant && (
                    <div className="break-inside-avoid mb-6 lg:mb-8">
                      <TaskColumn
                        title={`${currentParticipant.username} (you)`}
                        tasks={participantTasks(currentParticipant.id)}
                        isColumnOwner={true}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        togglingTaskId={taskState.togglingTaskId}
                      />
                    </div>
                  )}

                  {/* Other participants' task columns or Share CTA */}
                  {otherParticipants.length > 0 ? (
                    otherParticipants.map(participant => (
                      <div key={participant.id} className="break-inside-avoid mb-6 lg:mb-8">
                        <TaskColumn
                          title={participant.username}
                          tasks={participantTasks(participant.id)}
                          isColumnOwner={false}
                          onToggleTask={handleToggleTask}
                          onDeleteTask={handleDeleteTask}
                          onEditTask={handleEditTask}
                          togglingTaskId={taskState.togglingTaskId}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="break-inside-avoid mb-6 lg:mb-8">
                      <ShareRoomCTA sessionId={session.uuid} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
