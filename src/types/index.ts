export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type StudyMethod = 
  | 'blurring'
  | 'feynman'
  | 'cornell'
  | 'recall'
  | 'threeRooms'
  | 'backwards';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  pomodoros: number;
  order: number;
}

export interface Settings {
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStart: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'red';
}

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  sessionCount: number;
  startTime: number | null; // timestamp when timer started
  pausedAt: number | null; // timestamp when paused
  initialTimeRemaining: number | null; // initial time when timer started
}

export interface StudyMethodData {
  id: StudyMethod;
  name: string;
  description: string;
  workTips: string[];
  breakTips: string[];
}

