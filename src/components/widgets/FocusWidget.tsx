import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import { useFocusTimer } from "@/hooks/useFocusTimer";

interface Props {
  focusMinutes: number;
  breakMinutes: number;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function FocusWidget({ focusMinutes, breakMinutes }: Props) {
  const { mode, running, remainingMs, start, pause, reset } = useFocusTimer(focusMinutes, breakMinutes);

  return (
    <WidgetFrame icon={Timer} title="Focus">
      <div className="flex flex-col items-center gap-4 py-2">
        <span className="tabular text-4xl font-semibold text-ink">{formatCountdown(remainingMs)}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${
            mode === "focus" ? "bg-accent-soft text-accent" : "bg-amber/10 text-amber"
          }`}
        >
          {mode === "focus" ? "FOCUS" : "BREAK"}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={running ? pause : start}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="rounded-full border border-surface-border p-2 text-ink-faint transition-colors hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </WidgetFrame>
  );
}
