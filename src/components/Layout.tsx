import { useState, useEffect } from 'react';
import ModeSwitcher from './ModeSwitcher';
import Timer from './Timer';
import TimerControls from './TimerControls';
import TaskList from './TaskList';
import SettingsModal from './SettingsModal';
import { useTimerStore } from '../store/timerStore';

export default function Layout() {
  const [showSettings, setShowSettings] = useState(false);
  const theme = useTimerStore((state) => state.settings.theme);
  const stopAlarmMusic = useTimerStore((state) => state.stopAlarmMusic);

  // Apply dark mode class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen for Enter key to stop alarm music
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        stopAlarmMusic();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [stopAlarmMusic]);

  const themeClasses = {
    light: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900',
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100',
    red: 'bg-gradient-to-br from-red-50 via-red-100 to-red-50 text-gray-900',
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-pomo-red to-pomo-red-dark bg-clip-text text-transparent">
            Modus
          </h1>
        </header>

        {/* Mode Switcher */}
        <ModeSwitcher />

        {/* Timer */}
        <div className="my-6">
          <Timer />
          <TimerControls />
        </div>

        {/* Task List */}
        <TaskList />

        {/* Settings Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full p-3 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pomo-red"
            aria-label="Open settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}

