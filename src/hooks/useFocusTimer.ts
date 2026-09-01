import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/storage/storage";

type Mode = "focus" | "break";

interface FocusState {
  mode: Mode;
  running: boolean;
  endTimestamp: number | null; // set while running; remaining = endTimestamp - now
  remainingMs: number; // authoritative while paused
}

const KEY = "devtab:focus";

function initialState(focusMinutes: number): FocusState {
  return { mode: "focus", running: false, endTimestamp: null, remainingMs: focusMinutes * 60_000 };
}

function notify(title: string, body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, silent: false });
  }
}

export function useFocusTimer(focusMinutes: number, breakMinutes: number) {
  const [state, setState] = useState<FocusState>(() => initialState(focusMinutes));
  const [remaining, setRemaining] = useState(focusMinutes * 60_000);
  const stateRef = useRef(state);
  stateRef.current = state;
  const loaded = useRef(false);

  // Load any in-flight session from a previous tab/session.
  useEffect(() => {
    storage.get<FocusState>(KEY).then((saved) => {
      if (saved) setState(saved);
      loaded.current = true;
    });
  }, []);

  // Persist on every state change, once initial load has happened.
  useEffect(() => {
    if (loaded.current) storage.set(KEY, state);
  }, [state]);

  // Tick every second, deriving remaining time from the stored end timestamp
  // so drift and refreshes don't desync the countdown.
  useEffect(() => {
    function tick() {
      const s = stateRef.current;
      if (!s.running || s.endTimestamp == null) {
        setRemaining(s.remainingMs);
        return;
      }
      const left = s.endTimestamp - Date.now();
      if (left <= 0) {
        const nextMode: Mode = s.mode === "focus" ? "break" : "focus";
        const nextDuration = (nextMode === "focus" ? focusMinutes : breakMinutes) * 60_000;
        notify(
          s.mode === "focus" ? "Focus session complete" : "Break complete",
          s.mode === "focus" ? "Time for a short break." : "Back to focus when you're ready.",
        );
        setState({ mode: nextMode, running: false, endTimestamp: null, remainingMs: nextDuration });
        setRemaining(nextDuration);
      } else {
        setRemaining(left);
      }
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [focusMinutes, breakMinutes]);

  const start = useCallback(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setState((s) => ({ ...s, running: true, endTimestamp: Date.now() + s.remainingMs }));
  }, []);

  const pause = useCallback(() => {
    setState((s) => {
      if (!s.running || s.endTimestamp == null) return s;
      return { ...s, running: false, remainingMs: Math.max(0, s.endTimestamp - Date.now()), endTimestamp: null };
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = initialState(focusMinutes);
    setState(fresh);
    setRemaining(fresh.remainingMs);
  }, [focusMinutes]);

  return { mode: state.mode, running: state.running, remainingMs: remaining, start, pause, reset };
}
