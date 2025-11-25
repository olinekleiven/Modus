import { useState } from 'react';
import { useTimerStore } from '../store/timerStore';
import TaskItem from './TaskItem';

export default function TaskList() {
  const tasks = useTimerStore((state) => state.tasks);
  const addTask = useTimerStore((state) => state.addTask);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
        {totalCount > 0 && (
          <span className="text-sm font-medium opacity-80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full">
            {completedCount} / {totalCount} fullført
          </span>
        )}
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Hva jobber du med?"
            className="
              flex-1 px-5 py-3 rounded-xl
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
              border border-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-pomo-red focus:border-transparent
              placeholder-gray-400 dark:placeholder-gray-500
              shadow-sm hover:shadow-md transition-shadow
            "
            aria-label="Add new task"
          />
          <button
            type="submit"
            className="
              px-8 py-3 rounded-xl font-semibold
              bg-gradient-to-r from-pomo-red to-pomo-red-dark text-white
              shadow-lg shadow-pomo-red/30 hover:shadow-xl hover:shadow-pomo-red/40
              transition-all duration-200
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-pomo-red/50
            "
            aria-label="Add task"
          >
            Add
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No tasks yet. Add one above to get started!
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
}

