import { useState } from "react";
import { X } from "lucide-react";
import type { UserSettings } from "@/types";
import { GeneralSection } from "./settings/GeneralSection";
import { GithubSection } from "./settings/GithubSection";
import { CurrencySection } from "./settings/CurrencySection";
import { WeatherSection } from "./settings/WeatherSection";
import { WidgetsSection } from "./settings/WidgetsSection";
import { QuickLinksSection } from "./settings/QuickLinksSection";
import { BackgroundSection } from "./settings/BackgroundSection";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

const TABS = [
  { id: "general", label: "General" },
  { id: "github", label: "GitHub" },
  { id: "currency", label: "Currency" },
  { id: "weather", label: "Weather" },
  { id: "background", label: "Background" }, 
  { id: "widgets", label: "Widgets" },
  { id: "links", label: "Quick Links" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsDrawer({ open, onClose, settings, update }: SettingsDrawerProps) {
  const [tab, setTab] = useState<TabId>("general");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md animate-scale-in flex-col border-l border-surface-border bg-base-raised shadow-2xl">
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-full p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-b border-surface-border px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                tab === t.id ? "bg-accent-soft text-accent" : "text-ink-dim hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {tab === "general" && <GeneralSection settings={settings} update={update} />}
          {tab === "github" && <GithubSection settings={settings} update={update} />}
          {tab === "currency" && <CurrencySection settings={settings} update={update} />}
          {tab === "weather" && <WeatherSection settings={settings} update={update} />}
          {tab === "widgets" && <WidgetsSection settings={settings} update={update} />}
          {tab === "links" && <QuickLinksSection settings={settings} update={update} />}
          {tab === "background" && <BackgroundSection settings={settings} update={update} />}
        </div>
      </aside>
    </div>
  );
}
