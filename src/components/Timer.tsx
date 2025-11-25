import { useTimerStore } from '../store/timerStore';

export default function Timer() {
  const timeRemaining = useTimerStore((state) => state.timeRemaining);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-center">
      <div className="timer-number text-9xl md:text-[12rem] lg:text-[14rem] font-black mb-4 tracking-tighter text-gray-900 dark:text-white drop-shadow-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

