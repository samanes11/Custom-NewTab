import { Settings } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { formatFullDate, formatGreeting, formatTime } from "@/utils/format";

interface HeaderProps {
  userName: string;
  onOpenSettings: () => void;
}

export function Header({ userName, onOpenSettings }: HeaderProps) {
  const now = useClock();

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {formatGreeting(now)}
          {userName ? `, ${userName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink-dim">{formatFullDate(now)}</p>
      </div>

      <div className="flex items-center gap-3">
        <time className="tabular text-xl font-medium text-ink-dim">{formatTime(now)}</time>
        <button
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="rounded-full border border-surface-border bg-surface/60 p-2.5 text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
