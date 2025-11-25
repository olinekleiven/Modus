import { useTimerStore } from '../store/timerStore';
import type { TimerMode } from '../types';

export default function ModeSwitcher() {
  const mode = useTimerStore((state) => state.mode);
  const setMode = useTimerStore((state) => state.setMode);
  const isRunning = useTimerStore((state) => state.isRunning);

  const modes: { value: TimerMode; label: string }[] = [
    { value: 'pomodoro', label: 'Modus' },
    { value: 'shortBreak', label: 'Kort pause' },
    { value: 'longBreak', label: 'Lang pause' },
  ];

  const handleModeChange = (newMode: TimerMode) => {
    if (!isRunning) {
      setMode(newMode);
    }
  };

  return (
    <div className="flex justify-center gap-3 mb-6">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => handleModeChange(m.value)}
          disabled={isRunning}
          className={`
            px-8 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200
            ${
              mode === m.value
                ? 'bg-pomo-red text-white shadow-lg shadow-pomo-red/30 scale-105'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }
            ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pomo-red
          `}
          aria-label={`Switch to ${m.label} mode`}
          aria-pressed={mode === m.value}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

