import { User, Task, Session, AuthResponse } from '../types';

// Mock data
const users: User[] = [];
const sessions: Session[] = [];
let tasks: Task[] = []; // Using let here since we need to reassign it

// Authentication
export const register = async (username: string, email: string): Promise<AuthResponse> => {
  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  return { user: newUser, token: 'mock-token' };
};

export const login = async (email: string): Promise<AuthResponse> => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');
  return { user, token: 'mock-token' };
};

// Sessions
export const createSession = async (user1Id: string, user2Id: string): Promise<Session> => {
  const newSession: Session = {
    id: Date.now().toString(),
    user1_id: user1Id,
    user2_id: user2Id,
    tasks: [],
    created_at: new Date().toISOString(),
  };
  sessions.push(newSession);
  return newSession;
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  return sessions.filter(s => s.user1_id === userId || s.user2_id === userId);
};

// Tasks
export const getSessionTasks = async (sessionId: string): Promise<Task[]> => {
  return tasks.filter(t => t.session_id === sessionId);
};

export const addTask = async (sessionId: string, text: string): Promise<Task> => {
  const newTask: Task = {
    id: Date.now().toString(),
    session_id: sessionId,
    text,
    is_done: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks = [...tasks, newTask];
  return newTask;
};

export const updateTaskStatus = async (taskId: string, isDone: boolean): Promise<Task> => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');
  task.is_done = isDone;
  task.updated_at = new Date().toISOString();
  return task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  tasks = tasks.filter(t => t.id !== taskId);
}; 