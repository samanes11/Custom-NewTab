import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import { buildJalaliMonthGrid, JALALI_MONTH_LABELS, JALALI_WEEKDAY_LABELS, toJalali } from "@/utils/calendar";
import { AnimatePresence, motion } from "motion/react";

export function CalendarWidget() {
    const today = new Date();
    const todayJalali = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const [cursor, setCursor] = useState({ jy: todayJalali.jy, jm: todayJalali.jm });
    const grid = buildJalaliMonthGrid(cursor.jy, cursor.jm);
    const [direction, setDirection] = useState(1);

    function shiftMonth(delta: number) {
        setDirection(delta);
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
                    <button onClick={() => shiftMonth(-1)} aria-label="Previos" className="tap rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-medium text-ink">
                        {JALALI_MONTH_LABELS[cursor.jm - 1]} {cursor.jy}
                    </p>
                    <button onClick={() => shiftMonth(1)} aria-label="Next" className="tap rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-center">
                    {JALALI_WEEKDAY_LABELS.map((d, i) => (
                        <span key={i} className="text-[11px] font-medium tracking-label text-ink-faint">{d}</span>
                    ))}
                </div>
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                            key={`${cursor.jy}-${cursor.jm}`}
                            custom={direction}
                            initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.28 }}
                            className="grid grid-cols-7 gap-y-2 text-center"
                        >
                            {grid.map((cell) => (
                                <span
                                    key={cell.key}
                                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs tabular ${cell.isToday ? "bg-accent font-semibold text-white" : cell.inCurrentMonth ? "text-ink" : "text-ink-faint/50"
                                        }`}
                                >
                                    {cell.date}
                                </span>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </WidgetFrame>
    );
}