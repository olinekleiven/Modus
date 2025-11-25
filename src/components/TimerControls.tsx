import { useTimerStore } from '../store/timerStore';

export default function TimerControls() {
  const isRunning = useTimerStore((state) => state.isRunning);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={handleStartPause}
        className="
          px-10 py-4 rounded-xl font-bold text-lg
          bg-gradient-to-r from-pomo-red to-pomo-red-dark text-white
          shadow-lg shadow-pomo-red/40 hover:shadow-xl hover:shadow-pomo-red/50
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-pomo-red/50
        "
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      
      <button
        onClick={resetTimer}
        className="
          px-8 py-4 rounded-xl font-semibold
          bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
          hover:bg-white dark:hover:bg-gray-800
          text-gray-700 dark:text-gray-300
          border border-gray-200 dark:border-gray-700
          shadow-md hover:shadow-lg
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-gray-300/50
        "
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
}

