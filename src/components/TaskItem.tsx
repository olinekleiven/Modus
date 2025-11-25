import { useState } from 'react';
import { useTimerStore } from '../store/timerStore';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useTimerStore((state) => state.toggleTask);
  const deleteTask = useTimerStore((state) => state.deleteTask);
  const updateTask = useTimerStore((state) => state.updateTask);
  const reorderTasks = useTimerStore((state) => state.reorderTasks);
  const tasks = useTimerStore((state) => state.tasks);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleDragStart = (e: React.DragEvent) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === task.id) return;

    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedTasks.findIndex((t) => t.id === draggedId);
    const targetIndex = sortedTasks.findIndex((t) => t.id === task.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = sortedTasks.splice(draggedIndex, 1);
    sortedTasks.splice(targetIndex, 0, removed);

    // Update order values
    const reordered = sortedTasks.map((t, idx) => ({
      ...t,
      order: idx,
    }));

    reorderTasks(reordered);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const moveUp = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    const currentIndex = sortedTasks.findIndex((t) => t.id === task.id);
    if (currentIndex <= 0) return;

    [sortedTasks[currentIndex], sortedTasks[currentIndex - 1]] = [
      sortedTasks[currentIndex - 1],
      sortedTasks[currentIndex],
    ];

    const reordered = sortedTasks.map((t, idx) => ({
      ...t,
      order: idx,
    }));

    reorderTasks(reordered);
  };

  const moveDown = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    const currentIndex = sortedTasks.findIndex((t) => t.id === task.id);
    if (currentIndex >= sortedTasks.length - 1) return;

    [sortedTasks[currentIndex], sortedTasks[currentIndex + 1]] = [
      sortedTasks[currentIndex + 1],
      sortedTasks[currentIndex],
    ];

    const reordered = sortedTasks.map((t, idx) => ({
      ...t,
      order: idx,
    }));

    reorderTasks(reordered);
  };

  const handleDoubleClick = () => {
    if (!task.completed) {
      setIsEditing(true);
      setEditTitle(task.title);
    }
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`
        flex items-center gap-4 py-3 px-4 rounded-xl
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg hover:scale-[1.02]'}
        ${isEditing ? 'cursor-text' : 'cursor-move'}
        shadow-sm
      `}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`
          w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${
            task.completed
              ? 'bg-gradient-to-br from-pomo-red to-pomo-red-dark border-pomo-red shadow-md'
              : 'border-gray-300 dark:border-gray-600 hover:border-pomo-red hover:bg-gray-50 dark:hover:bg-gray-700'
          }
          focus:outline-none focus:ring-2 focus:ring-pomo-red
        `}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        aria-pressed={task.completed}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Task Title */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="
            flex-1 text-base font-medium
            bg-transparent border-b-2 border-pomo-red
            text-gray-900 dark:text-gray-100
            focus:outline-none
            px-1
          "
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          className={`
            flex-1 text-base font-medium
            ${task.completed ? 'line-through opacity-50' : 'text-gray-900 dark:text-gray-100 cursor-text'}
          `}
          title={task.completed ? '' : 'Double-click to edit'}
        >
          {task.title}
        </span>
      )}

      {/* Pomodoro Count */}
      {task.pomodoros > 0 && (
        <span className="text-sm opacity-60">
          {task.pomodoros}
        </span>
      )}

      {/* Move Buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={moveUp}
          className="
            p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-pomo-red
            transition-colors
          "
          aria-label="Move task up"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          onClick={moveDown}
          className="
            p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-pomo-red
            transition-colors
          "
          aria-label="Move task down"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => deleteTask(task.id)}
        className="
          p-2 rounded hover:bg-red-100 dark:hover:bg-red-900
          text-red-600 dark:text-red-400
          focus:outline-none focus:ring-2 focus:ring-red-500
          transition-colors
        "
        aria-label="Delete task"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

