/**
 * Thin wrapper around chrome.storage.local so the rest of the app never
 * talks to the extension API directly. Falls back to window.localStorage
 * when chrome.storage isn't available (e.g. `npm run dev` in a normal
 * browser tab), so the dashboard is developable outside the extension host.
 */

const hasChromeStorage =
  typeof chrome !== "undefined" && !!chrome.storage && !!chrome.storage.local;

async function get<T>(key: string): Promise<T | undefined> {
  if (hasChromeStorage) {
    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  }
  const raw = window.localStorage.getItem(key);
  if (raw == null) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  if (hasChromeStorage) {
    await chrome.storage.local.set({ [key]: value });
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function remove(key: string): Promise<void> {
  if (hasChromeStorage) {
    await chrome.storage.local.remove(key);
    return;
  }
  window.localStorage.removeItem(key);
}

/** Fires `callback` whenever `key` changes, from any part of the extension. */
function watch<T>(key: string, callback: (value: T | undefined) => void): () => void {
  if (hasChromeStorage) {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && key in changes) {
        callback(changes[key].newValue as T | undefined);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }
  const listener = (e: StorageEvent) => {
    if (e.key === key) {
      callback(e.newValue ? (JSON.parse(e.newValue) as T) : undefined);
    }
  };
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

export const storage = { get, set, remove, watch };
