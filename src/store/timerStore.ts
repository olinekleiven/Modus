import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode, TimerState, Settings, Task, StudyMethod } from '../types';

interface TimerStore extends TimerState {
  settings: Settings;
  tasks: Task[];
  selectedStudyMethod: StudyMethod | null;
  
  // Timer actions
  setMode: (mode: TimerMode) => void;
  setTimeRemaining: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  finishSession: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Task actions
  addTask: (title: string, pomodoros?: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  reorderTasks: (tasks: Task[]) => void;
  
  // Study method actions
  setStudyMethod: (method: StudyMethod | null) => void;
  
  // Initialize timer from persisted state
  initializeTimer: () => void;
  
  // Alarm music control
  stopAlarmMusic: () => void;
}

const STORAGE_KEY = 'modus-timer-store';

// Global reference to alarm music
let alarmMusic: HTMLAudioElement | null = null;

const defaultSettings: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStart: false,
  soundEnabled: true,
  theme: 'red',
};

const getInitialDuration = (mode: TimerMode, settings: Settings): number => {
  switch (mode) {
    case 'pomodoro':
      return settings.pomodoroDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
};

const playStartSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play two ascending tones for start
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600 + (i * 200); // Ascending: 600Hz, then 800Hz
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      }, i * 100);
    }
  } catch (e) {
    console.log('Start sound failed');
  }
};

const playResetSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play a descending tone for reset
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    console.log('Reset sound failed');
  }
};

const playAlarmMusic = () => {
  try {
    // Stop any existing music
    if (alarmMusic) {
      alarmMusic.pause();
      alarmMusic.currentTime = 0;
    }
    
    // Create and play the music starting from 6 seconds
    alarmMusic = new Audio('/simple.mp3');
    alarmMusic.loop = true;
    alarmMusic.volume = 0.7;
    alarmMusic.currentTime = 6; // Start from 0:06
    alarmMusic.play().catch((e) => {
      console.log('Failed to play alarm music:', e);
    });
  } catch (e) {
    console.log('Alarm music failed');
  }
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      timeRemaining: defaultSettings.pomodoroDuration * 60,
      isRunning: false,
      sessionCount: 0,
      startTime: null,
      pausedAt: null,
      initialTimeRemaining: null,
      settings: defaultSettings,
      tasks: [],
      selectedStudyMethod: null,

      setMode: (mode) => {
        const { settings } = get();
        set({
          mode,
          timeRemaining: getInitialDuration(mode, settings),
          isRunning: false,
          startTime: null,
          pausedAt: null,
          initialTimeRemaining: null,
        });
      },

      setTimeRemaining: (seconds) => {
        set({ timeRemaining: Math.max(0, seconds) });
      },

      startTimer: () => {
        const { pausedAt, startTime, timeRemaining, initialTimeRemaining } = get();
        const now = Date.now();
        
        if (pausedAt && startTime && initialTimeRemaining !== null) {
          // Resume from pause - calculate how much time was already elapsed
          const elapsed = Math.floor((pausedAt - startTime) / 1000);
          const newStartTime = now - elapsed * 1000;
          const { settings } = get();
          if (settings.soundEnabled) {
            playStartSound();
          }
          set({
            isRunning: true,
            startTime: newStartTime,
            pausedAt: null,
          });
        } else {
          // Fresh start - store current timeRemaining as initial
          const { settings } = get();
          if (settings.soundEnabled) {
            playStartSound();
          }
          set({
            isRunning: true,
            startTime: now,
            pausedAt: null,
            initialTimeRemaining: timeRemaining,
          });
        }
      },

      pauseTimer: () => {
        const { startTime, initialTimeRemaining } = get();
        if (startTime && initialTimeRemaining !== null) {
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const newTimeRemaining = Math.max(0, initialTimeRemaining - elapsed);
          
          set({
            isRunning: false,
            pausedAt: now,
            timeRemaining: newTimeRemaining,
          });
        }
      },

      resetTimer: () => {
        const { mode, settings } = get();
        if (settings.soundEnabled) {
          playResetSound();
        }
        set({
          timeRemaining: getInitialDuration(mode, settings),
          isRunning: false,
          startTime: null,
          pausedAt: null,
          initialTimeRemaining: null,
        });
      },

      tick: () => {
        const { isRunning, startTime, initialTimeRemaining } = get();
        
        if (!isRunning || !startTime || initialTimeRemaining === null) return;
        
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const newTimeRemaining = Math.max(0, initialTimeRemaining - elapsed);
        
        if (newTimeRemaining === 0) {
          get().finishSession();
        } else {
          set({ timeRemaining: newTimeRemaining });
        }
      },

      finishSession: () => {
        const { mode, settings, sessionCount } = get();
        
        // Play alarm music when timer finishes
        if (settings.soundEnabled) {
          playAlarmMusic();
        }
        
        // Auto-switch to next mode
        let nextMode: TimerMode = 'pomodoro';
        if (mode === 'pomodoro') {
          nextMode = sessionCount % 3 === 2 ? 'longBreak' : 'shortBreak';
        }
        
        const newSessionCount = mode === 'pomodoro' ? sessionCount + 1 : sessionCount;
        
        set({
          mode: nextMode,
          timeRemaining: getInitialDuration(nextMode, settings),
          isRunning: settings.autoStart,
          startTime: settings.autoStart ? Date.now() : null,
          pausedAt: null,
          initialTimeRemaining: settings.autoStart ? getInitialDuration(nextMode, settings) : null,
          sessionCount: newSessionCount,
        });
      },

      updateSettings: (newSettings) => {
        const { settings, mode } = get();
        const updatedSettings = { ...settings, ...newSettings };
        
        // Update timer if duration changed for current mode
        const currentDuration = getInitialDuration(mode, updatedSettings);
        
        set({
          settings: updatedSettings,
          timeRemaining: currentDuration,
        });
      },

      addTask: (title, pomodoros = 1) => {
        const { tasks } = get();
        // New tasks go to the top (order 0), shift all existing tasks down
        const updatedTasks = tasks.map((task) => ({
          ...task,
          order: task.order + 1,
        }));
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          completed: false,
          pomodoros,
          order: 0,
        };
        set({ tasks: [newTask, ...updatedTasks] });
      },

      toggleTask: (id) => {
        const { tasks } = get();
        const toggledTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        
        // Find the toggled task
        const toggledTask = toggledTasks.find((t) => t.id === id);
        if (!toggledTask) return;
        
        // If task was just completed, move it to the bottom
        if (toggledTask.completed) {
          const maxOrder = Math.max(...toggledTasks.map((t) => t.order), -1);
          const completedTasks = toggledTasks.filter((t) => t.completed && t.id !== id);
          const uncompletedTasks = toggledTasks.filter((t) => !t.completed);
          
          // Set the toggled task to the bottom
          toggledTask.order = maxOrder + 1;
          
          // Reorder: uncompleted first, then completed (with toggled task at the very bottom)
          const reorderedTasks = [
            ...uncompletedTasks,
            ...completedTasks,
            toggledTask,
          ];
          
          set({ tasks: reorderedTasks });
        } else {
          // If task was uncompleted, move it to the top
          const uncompletedTasks = toggledTasks.filter((t) => !t.completed && t.id !== id);
          const completedTasks = toggledTasks.filter((t) => t.completed);
          
          // Shift all uncompleted tasks down
          const updatedUncompleted = uncompletedTasks.map((t) => ({
            ...t,
            order: t.order + 1,
          }));
          
          // Put the uncompleted task at the top
          toggledTask.order = 0;
          
          const reorderedTasks = [
            toggledTask,
            ...updatedUncompleted,
            ...completedTasks,
          ];
          
          set({ tasks: reorderedTasks });
        }
      },

      deleteTask: (id) => {
        const { tasks } = get();
        set({ tasks: tasks.filter((task) => task.id !== id) });
      },

      updateTask: (id, updates) => {
        const { tasks } = get();
        set({
          tasks: tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        });
      },

      reorderTasks: (reorderedTasks) => {
        set({ tasks: reorderedTasks });
      },

      setStudyMethod: (method) => {
        set({ selectedStudyMethod: method });
      },

      initializeTimer: () => {
        const { isRunning, startTime, initialTimeRemaining } = get();
        
        if (isRunning && startTime && initialTimeRemaining !== null) {
          // Calculate actual remaining time
          const now = Date.now();
          const elapsed = Math.floor((now - startTime) / 1000);
          const newTimeRemaining = Math.max(0, initialTimeRemaining - elapsed);
          
          if (newTimeRemaining === 0) {
            get().finishSession();
          } else {
            set({ timeRemaining: newTimeRemaining });
          }
        }
      },

      stopAlarmMusic: () => {
        if (alarmMusic) {
          alarmMusic.pause();
          alarmMusic.currentTime = 0;
          alarmMusic = null;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        mode: state.mode,
        timeRemaining: state.timeRemaining,
        isRunning: state.isRunning,
        sessionCount: state.sessionCount,
        startTime: state.startTime,
        pausedAt: state.pausedAt,
        initialTimeRemaining: state.initialTimeRemaining,
        settings: state.settings,
        tasks: state.tasks,
        selectedStudyMethod: state.selectedStudyMethod,
      }),
    }
  )
);

