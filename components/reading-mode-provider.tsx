"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface ReadingModeState {
  readingMode: boolean;
  setReadingMode: (value: boolean) => void;
}

const DEFAULT_STATE: ReadingModeState = {
  readingMode: false,
  setReadingMode: () => {},
};

const ReadingModeContext = createContext<ReadingModeState | null>(null);

export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [readingMode, setReadingMode] = useState(false);

  const value = useMemo(() => ({ readingMode, setReadingMode }), [readingMode]);

  return (
    <ReadingModeContext.Provider value={value}>
      {children}
    </ReadingModeContext.Provider>
  );
}

/** Falls back to a no-op state outside the provider, so consumers stay safe anywhere. */
export function useReadingMode(): ReadingModeState {
  return useContext(ReadingModeContext) ?? DEFAULT_STATE;
}
