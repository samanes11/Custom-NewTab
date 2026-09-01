import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/storage/storage";
import { DEFAULT_SETTINGS } from "@/config";
import type { UserSettings } from "@/types";

const SETTINGS_KEY = "devtab:settings";

/** Merge saved settings over defaults so new fields introduced by an
 * update never leave the app with `undefined` values. */
function mergeWithDefaults(saved: Partial<UserSettings> | undefined): UserSettings {
  if (!saved) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    widgetEnabled: { ...DEFAULT_SETTINGS.widgetEnabled, ...saved.widgetEnabled },
    widgetOrder: saved.widgetOrder?.length ? saved.widgetOrder : DEFAULT_SETTINGS.widgetOrder,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    storage.get<UserSettings>(SETTINGS_KEY).then((saved) => {
      if (cancelled) return;
      setSettings(mergeWithDefaults(saved));
      setLoaded(true);
      loadedRef.current = true;
    });
    const unwatch = storage.watch<UserSettings>(SETTINGS_KEY, (value) => {
      // Keep multiple open new-tab pages in sync with each other.
      if (value) setSettings(mergeWithDefaults(value));
    });
    return () => {
      cancelled = true;
      unwatch();
    };
  }, []);

  const update = useCallback((patch: Partial<UserSettings> | ((prev: UserSettings) => UserSettings)) => {
    setSettings((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      // Don't persist until the initial load completed, or we'd overwrite
      // saved settings with defaults during the brief loading window.
      if (loadedRef.current) storage.set(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  return { settings, update, loaded };
}
