import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loadSession, saveSession, resetSession,
  type SessionState, type TaskProgress, getProgress, setProgress, totalPoints,
} from '@/engine/session-store';

interface SessionApi {
  session: SessionState;
  totalPoints: number;
  getTaskProgress: (id: string) => TaskProgress;
  updateTaskProgress: (id: string, p: TaskProgress) => void;
  resetAll: () => void;
}

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(() => loadSession());

  useEffect(() => { saveSession(session); }, [session]);

  const getTaskProgress = useCallback((id: string) => getProgress(session, id), [session]);

  const updateTaskProgress = useCallback((id: string, p: TaskProgress) => {
    setSession(prev => setProgress(prev, id, p));
  }, []);

  const resetAll = useCallback(() => { setSession(resetSession()); }, []);

  const value: SessionApi = {
    session,
    totalPoints: totalPoints(session),
    getTaskProgress,
    updateTaskProgress,
    resetAll,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionApi {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
