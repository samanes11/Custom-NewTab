import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { buildJalaliMonthGrid, JALALI_MONTH_LABELS, JALALI_WEEKDAY_LABELS, toJalali } from "@/utils/calendar";

function formatClockTime(date: Date): string {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function CalendarClockHero() {
    const now = useClock();
    const todayJalali = toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const [cursor, setCursor] = useState({ jy: todayJalali.jy, jm: todayJalali.jm });
    const grid = buildJalaliMonthGrid(cursor.jy, cursor.jm);

    function shiftMonth(delta: number) {
        setCursor((prev) => {
            let jm = prev.jm + delta;
            let jy = prev.jy;
            if (jm > 12) { jm = 1; jy += 1; }
            if (jm < 1) { jm = 12; jy -= 1; }
            return { jy, jm };
        });
    }

    return (
        <section className="mx-auto flex w-full max-w-3xl animate-fade-in flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-center">
            <div className="glass-panel flex flex-col items-center justify-center rounded-card px-8 py-6 sm:w-64">
                <span className="tabular text-5xl font-semibold text-ink">{formatClockTime(now)}</span>
                <span className="mt-2 text-sm text-ink-dim">
                    {JALALI_MONTH_LABELS[todayJalali.jm - 1]} {todayJalali.jd}، {todayJalali.jy}
                </span>
            </div>

            <div dir="rtl" className="glass-panel w-full max-w-sm rounded-card px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                    <button onClick={() => shiftMonth(-1)} aria-label="ماه قبل" className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <p className="text-base font-medium text-ink">
                        {JALALI_MONTH_LABELS[cursor.jm - 1]} {cursor.jy}
                    </p>
                    <button onClick={() => shiftMonth(1)} aria-label="ماه بعد" className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                <div key={`${cursor.jy}-${cursor.jm}`} className="grid animate-fade-in grid-cols-7 gap-y-2 text-center" style={{ animationDuration: "0.25s" }}>
                    {JALALI_WEEKDAY_LABELS.map((d, i) => (
                        <span key={i} className="text-[12px] font-medium text-ink-faint">{d}</span>
                    ))}
                    {grid.map((cell) => (
                        <span
                            key={cell.key}
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm tabular ${cell.isToday ? "bg-accent font-semibold text-white" : cell.inCurrentMonth ? "text-ink" : "text-ink-faint/50"
                                }`}
                        >
                            {cell.date}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}