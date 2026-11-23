"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RfqLine } from "@/lib/types";

const STORAGE_KEY = "tp_my_rfq";

interface RfqContextValue {
  lines: RfqLine[];
  count: number;
  addLine: (line: RfqLine) => void;
  updateLine: (index: number, patch: Partial<RfqLine>) => void;
  removeLine: (index: number) => void;
  clear: () => void;
}

const RfqContext = createContext<RfqContextValue | null>(null);

function readStorage(): RfqLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RfqLine[]) : [];
  } catch {
    return [];
  }
}

export function RfqProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<RfqLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from localStorage (an external system) after mount, so
    // the server-rendered empty basket matches the client's first render
    // and only then picks up whatever the visitor had saved.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // localStorage unavailable (private mode, quota) — basket stays in-memory only
    }
  }, [lines, hydrated]);

  const addLine = useCallback((line: RfqLine) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex(
        (l) => l.part_number === line.part_number && l.brand === line.brand
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + line.quantity,
        };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const updateLine = useCallback((index: number, patch: Partial<RfqLine>) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l))
    );
  }, []);

  const removeLine = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<RfqContextValue>(
    () => ({ lines, count: lines.length, addLine, updateLine, removeLine, clear }),
    [lines, addLine, updateLine, removeLine, clear]
  );

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq(): RfqContextValue {
  const ctx = useContext(RfqContext);
  if (!ctx) throw new Error("useRfq must be used within RfqProvider");
  return ctx;
}
