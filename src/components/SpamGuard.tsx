"use client";

import { useCallback, useEffect, useRef } from "react";

/** Hidden trap field. People never see or fill it; bots that fill every input do. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="hp-field">
      <label>
        Leave this field empty
        <input name="hp_contact" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** Returns a function giving how many milliseconds the form has been open. */
export function useFormTimer() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return useCallback(() => (startedAt.current ? Date.now() - startedAt.current : 0), []);
}
