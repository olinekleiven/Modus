import { useState, useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';
import type { Settings } from '../types';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useTimerStore((state) => state.settings);
  const updateSettings = useTimerStore((state) => state.updateSettings);
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-label="Close settings"
    >
      <div
        className="
          bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6
          max-h-[90vh] overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-pomo-red
            "
            aria-label="Close settings"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Durations */}
          <div>
            <h3 className="font-semibold mb-4">Timer Durations (minutes)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Pomodoro</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.pomodoroDuration}
                  onChange={(e) =>
                    handleChange('pomodoroDuration', parseInt(e.target.value) || 25)
                  }
                  className="
                    w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-pomo-red
                  "
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) =>
                    handleChange('shortBreakDuration', parseInt(e.target.value) || 5)
                  }
                  className="
                    w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-pomo-red
                  "
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) =>
                    handleChange('longBreakDuration', parseInt(e.target.value) || 15)
                  }
                  className="
                    w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-pomo-red
                  "
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="font-semibold mb-4">Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Auto-start next session</span>
                <input
                  type="checkbox"
                  checked={localSettings.autoStart}
                  onChange={(e) => handleChange('autoStart', e.target.checked)}
                  className="
                    w-5 h-5 rounded border-gray-300 dark:border-gray-600
                    text-pomo-red focus:ring-pomo-red
                  "
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Sound notifications</span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="
                    w-5 h-5 rounded border-gray-300 dark:border-gray-600
                    text-pomo-red focus:ring-pomo-red
                  "
                />
              </label>
            </div>
          </div>

          {/* Theme */}
          <div>
            <h3 className="font-semibold mb-4">Theme</h3>
            <div className="space-y-2">
              {(['light', 'dark', 'red'] as const).map((theme) => (
                <label
                  key={theme}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={localSettings.theme === theme}
                    onChange={() => handleChange('theme', theme)}
                    className="
                      w-4 h-4 text-pomo-red focus:ring-pomo-red
                    "
                  />
                  <span className="capitalize">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg font-medium
              bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-gray-400
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="
              px-4 py-2 rounded-lg font-medium
              bg-pomo-red hover:bg-pomo-red-dark text-white
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-pomo-red
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

