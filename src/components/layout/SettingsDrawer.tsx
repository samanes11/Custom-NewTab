import { useState } from "react";
import { X } from "lucide-react";
import type { UserSettings } from "@/types";
import { GeneralSection } from "./settings/GeneralSection";
import { WidgetsSection } from "./settings/WidgetsSection";
import { BackgroundSection } from "./settings/BackgroundSection";
import { AnimatePresence, motion } from "motion/react";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

const TABS = [
  { id: "general", label: "General" },
  { id: "background", label: "Background" },
  { id: "widgets", label: "Widgets" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsDrawer({ open, onClose, settings, update }: SettingsDrawerProps) {
  const [tab, setTab] = useState<TabId>("general");

  if (!open) return null;

  // بعد
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="glass-panel-heavy relative flex h-full w-full max-w-md flex-col border-l border-surface-border shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.32 }}
          > <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-ink">Settings</h2>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="tap rounded-full p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex gap-1 overflow-x-auto border-b border-surface-border px-3 py-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`tap shrink-0 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${tab === t.id ? "bg-accent-soft text-accent" : "text-ink-dim hover:text-ink"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="scroll-fade-top flex-1 overflow-y-auto px-5 py-5">
              {tab === "general" && <GeneralSection settings={settings} update={update} />}
              {tab === "widgets" && <WidgetsSection settings={settings} update={update} />}
              {tab === "background" && <BackgroundSection settings={settings} update={update} />}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}