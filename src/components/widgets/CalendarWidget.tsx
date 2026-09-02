import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import { buildJalaliMonthGrid, JALALI_MONTH_LABELS, JALALI_WEEKDAY_LABELS, toJalali } from "@/utils/calendar";

export function CalendarWidget() {
    const today = new Date();
    const todayJalali = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
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
        <WidgetFrame icon={Calendar} title="Calendar">
            <div dir="rtl">
                <div className="mb-4 flex items-center justify-between">
                    <button onClick={() => shiftMonth(-1)} aria-label="ماه قبل" className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-medium text-ink">
                        {JALALI_MONTH_LABELS[cursor.jm - 1]} {cursor.jy}
                    </p>
                    <button onClick={() => shiftMonth(1)} aria-label="ماه بعد" className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                <div key={`${cursor.jy}-${cursor.jm}`} className="grid animate-fade-in grid-cols-7 gap-y-2 text-center" style={{ animationDuration: "0.25s" }}>
                    {JALALI_WEEKDAY_LABELS.map((d, i) => (
                        <span key={i} className="text-[11px] font-medium text-ink-faint">{d}</span>
                    ))}
                    {grid.map((cell) => (
                        <span
                            key={cell.key}
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs tabular ${cell.isToday ? "bg-accent font-semibold text-white" : cell.inCurrentMonth ? "text-ink" : "text-ink-faint/50"
                                }`}
                        >
                            {cell.date}
                        </span>
                    ))}
                </div>
            </div>
        </WidgetFrame>
    );
}