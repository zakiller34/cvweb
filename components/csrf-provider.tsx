"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CsrfContext = createContext<string | null>(null);

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

export function CsrfProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getCsrfTokenFromCookie());
  }, []);

  return (
    <CsrfContext.Provider value={token}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrf(): string | null {
  return useContext(CsrfContext);
}
