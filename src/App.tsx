import { useEffect } from 'react';
import Layout from './components/Layout';
import { useTimerStore } from './store/timerStore';

function App() {
  const initializeTimer = useTimerStore((state) => state.initializeTimer);
  const tick = useTimerStore((state) => state.tick);

  // Initialize timer on mount (restore from localStorage)
  useEffect(() => {
    initializeTimer();
  }, [initializeTimer]);

  // Timer tick interval
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  return <Layout />;
}

export default App;

