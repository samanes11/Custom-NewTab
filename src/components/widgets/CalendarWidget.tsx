import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import { buildMonthGrid, MONTH_LABELS, WEEKDAY_LABELS } from "@/utils/calendar";

export function CalendarWidget() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const grid = buildMonthGrid(cursor.year, cursor.month);

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <WidgetFrame
      icon={CalendarDays}
      title="Calendar"
      action={
        <div className="flex items-center gap-1">
          <button
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="rounded-md p-1 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="rounded-md p-1 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    >
      <p className="mb-3 text-sm font-medium text-ink">
        {MONTH_LABELS[cursor.month]} {cursor.year}
      </p>

      <div
        key={`${cursor.year}-${cursor.month}`}
        className="grid animate-fade-in grid-cols-7 gap-y-1.5 text-center"
        style={{ animationDuration: "0.25s" }}
      >
        {WEEKDAY_LABELS.map((d) => (
          <span key={d} className="text-[11px] font-medium text-ink-faint">
            {d}
          </span>
        ))}
        {grid.map((cell) => (
          <span
            key={cell.key}
            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[13px] tabular ${
              cell.isToday
                ? "bg-accent font-semibold text-white"
                : cell.inCurrentMonth
                  ? "text-ink"
                  : "text-ink-faint/50"
            }`}
          >
            {cell.date}
          </span>
        ))}
      </div>
    </WidgetFrame>
  );
}
