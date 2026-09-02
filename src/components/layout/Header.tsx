import { Settings } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="flex items-center justify-end animate-fade-in">
      <button
        onClick={onOpenSettings}
        aria-label="Open settings"
        className="rounded-full border border-surface-border bg-surface/60 p-2.5 text-ink-dim transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Settings className="h-4 w-4" />
      </button>
    </header>
  );
}