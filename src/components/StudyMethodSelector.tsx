import { useTimerStore } from '../store/timerStore';
import { studyMethods } from '../data/studyMethods';
import type { StudyMethod } from '../types';

export default function StudyMethodSelector() {
  const selectedMethod = useTimerStore((state) => state.selectedStudyMethod);
  const setStudyMethod = useTimerStore((state) => state.setStudyMethod);
  const isRunning = useTimerStore((state) => state.isRunning);

  const handleMethodChange = (method: StudyMethod | null) => {
    if (!isRunning) {
      setStudyMethod(method);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Study Method
      </label>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleMethodChange(null)}
          disabled={isRunning}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${
              selectedMethod === null
                ? 'bg-pomo-red text-white shadow-md'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }
            ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            focus:outline-none focus:ring-2 focus:ring-pomo-red
          `}
          aria-label="No study method"
        >
          None
        </button>
        {studyMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleMethodChange(method.id)}
            disabled={isRunning}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                selectedMethod === method.id
                  ? 'bg-pomo-red text-white shadow-md'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }
              ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              focus:outline-none focus:ring-2 focus:ring-pomo-red
            `}
            aria-label={`Select ${method.name}`}
            title={method.description}
          >
            {method.name}
          </button>
        ))}
      </div>
    </div>
  );
}

