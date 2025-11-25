import { useState, useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';
import { studyMethods } from '../data/studyMethods';

export default function TipsPanel() {
  const selectedMethod = useTimerStore((state) => state.selectedStudyMethod);
  const mode = useTimerStore((state) => state.mode);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Reset tip index when method or mode changes
  useEffect(() => {
    setCurrentTipIndex(0);
  }, [selectedMethod, mode]);

  if (!selectedMethod) {
    return null;
  }

  const method = studyMethods.find((m) => m.id === selectedMethod);
  if (!method) return null;

  // Get tips based on current mode
  const tips = mode === 'pomodoro' ? method.workTips : method.breakTips;
  
  if (tips.length === 0) return null;

  const currentTip = tips[currentTipIndex % tips.length];

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-pomo-red uppercase tracking-wide">
                {method.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'pomodoro' ? 'Work Tip' : 'Break Tip'}
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentTip}
            </p>
          </div>
          {tips.length > 1 && (
            <button
              onClick={handleNextTip}
              className="
                flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium
                bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-pomo-red
              "
              aria-label="Next tip"
            >
              Next
            </button>
          )}
        </div>
        {tips.length > 1 && (
          <div className="mt-3 flex gap-1 justify-center">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`
                  h-1.5 rounded-full transition-all duration-200
                  ${
                    index === currentTipIndex % tips.length
                      ? 'bg-pomo-red w-6'
                      : 'bg-gray-300 dark:bg-gray-600 w-1.5'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

