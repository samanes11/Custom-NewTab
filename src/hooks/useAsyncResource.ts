import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/storage/storage";
import type { AsyncState } from "@/types";

const cacheKey = (key: string) => `devtab:cache:${key}`;

interface Options {
  /** Poll again after this many ms. Omit to fetch once (still refetches on deps change). */
  intervalMs?: number;
  /** Skip fetching entirely, e.g. because a required setting is missing. */
  enabled?: boolean;
}

/**
 * Fetches `fetcher()`, persists the last good value to storage, and shows
 * it immediately on next load (marked as live once refreshed). If a fetch
 * fails, previously cached data is kept visible alongside the error so a
 * single flaky API never blanks out a widget.
 */
export function useAsyncResource<T>(
  key: string,
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  options: Options = {},
): { state: AsyncState<T>; refetch: () => void } {
  const { intervalMs, enabled = true } = options;
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const lastGood = useRef<T | undefined>(undefined);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    try {
      const data = await fetcherRef.current();
      lastGood.current = data;
      const isEmpty = data == null || (Array.isArray(data) && data.length === 0);
      setState(isEmpty ? { status: "empty" } : { status: "success", data });
      if (!isEmpty) storage.set(cacheKey(key), data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState({ status: "error", message, stale: lastGood.current });
    }
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    if (!enabled) {
      setState({ status: "empty" });
      return;
    }

    (async () => {
      const cached = await storage.get<T>(cacheKey(key));
      if (cancelled) return;
      if (cached !== undefined) {
        lastGood.current = cached;
        setState({ status: "success", data: cached });
      } else {
        setState({ status: "loading" });
      }
      await run();
    })();

    let id: number | undefined;
    if (intervalMs) {
      id = window.setInterval(run, intervalMs);
    }
    return () => {
      cancelled = true;
      if (id) window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, intervalMs, ...deps]);

  return { state, refetch: run };
}
