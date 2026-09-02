import { useClock } from "@/hooks/useClock";
import { formatClock12, formatFullDate, formatGreeting } from "@/utils/format";

interface ClockHeroProps {
    userName: string;
}

export function ClockHero({ userName }: ClockHeroProps) {
    const now = useClock();
    const { time, period } = formatClock12(now);

    return (
        <section className="mx-auto flex flex-col items-center gap-1 py-6 text-center animate-fade-in">
            <div className="flex flex-row items-end">
                <span className="tabular text-6xl font-semibold leading-none text-ink">{time}</span>
                <span className="mt-1 text-xl font-medium tracking-wide text-ink-dim">{period}</span>
            </div>
            <p className="mt-3 text-lg font-medium text-ink">
                {formatGreeting(now)}{userName ? `, ${userName}` : ""}
            </p>
            <p className="text-sm text-ink-dim">{formatFullDate(now)}</p>
        </section>
    );
}