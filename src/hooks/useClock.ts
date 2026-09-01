import { useEffect, useState } from "react";

/** Ticks every second, but only causes a re-render when the visible
 * minute actually changes for the date, so consumers can subscribe to
 * `now` without over-rendering. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
