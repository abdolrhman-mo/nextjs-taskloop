'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [makadyTasks, setMakadyTasks] = useState<Task[]>([]);
  const [mohamedTasks, setMohamedTasks] = useState<Task[]>([]);

  const addTask = (user: 'makady' | 'mohamed', taskText: string) => {
    if (!taskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false
    };

    if (user === 'makady') {
      setMakadyTasks([...makadyTasks, newTask]);
    } else {
      setMohamedTasks([...mohamedTasks, newTask]);
    }
  };

  const toggleTask = (user: 'makady' | 'mohamed', taskId: string) => {
    if (user === 'makady') {
      setMakadyTasks(makadyTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } else {
      setMohamedTasks(mohamedTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const TaskSection = ({ 
    username, 
    tasks, 
    onAddTask,
    onToggleTask
  }: { 
    username: string;
    tasks: Task[];
    onAddTask: (taskText: string) => void;
    onToggleTask: (taskId: string) => void;
  }) => {
    const [newTask, setNewTask] = useState('');
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newTask.trim()) {
        onAddTask(newTask);
        setNewTask('');
      }
    };

    return (
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">{username}</h2>
        
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </form>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Active Tasks</h3>
            <div className="space-y-2">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center p-2 bg-white rounded-md shadow"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="mr-2"
                  />
                  <span className="text-gray-800">{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Completed Tasks</h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center p-2 bg-white rounded-md shadow"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="mr-2"
                  />
                  <span className="text-gray-800 line-through">{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Session {sessionId}</h1>
        
        <div className="flex gap-8">
          <TaskSection
            username="Makady"
            tasks={makadyTasks}
            onAddTask={(taskText) => addTask('makady', taskText)}
            onToggleTask={(taskId) => toggleTask('makady', taskId)}
          />
          
          <div className="w-px bg-gray-700" />
          
          <TaskSection
            username="Mohamed"
            tasks={mohamedTasks}
            onAddTask={(taskText) => addTask('mohamed', taskText)}
            onToggleTask={(taskId) => toggleTask('mohamed', taskId)}
          />
        </div>
      </div>
    </div>
  );
} 