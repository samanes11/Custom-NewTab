import type { ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AsyncState } from "@/types";
import { SkeletonLines } from "./Skeleton";

interface WidgetFrameProps {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function WidgetFrame({ icon: Icon, title, action, children, className = "" }: WidgetFrameProps) {
  return (
    <section className={`widget-card animate-fade-in ${className}`}>
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-ink-dim">
          <Icon className="h-4 w-4" strokeWidth={2} />
          <h2 className="text-[13px] font-medium tracking-normal text-ink-dim">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

interface StateViewProps<T> {
  state: AsyncState<T>;
  emptyLabel?: string;
  skeletonLines?: number;
  children: (data: T, stale?: boolean) => ReactNode;
}

/** Renders the right thing for each AsyncState, so widgets only ever
 * write the "success" render path themselves. */
export function StateView<T>({ state, emptyLabel = "Nothing to show yet", skeletonLines = 3, children }: StateViewProps<T>) {
  if (state.status === "loading") {
    return <SkeletonLines count={skeletonLines} />;
  }
  if (state.status === "empty") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4 text-center">
        <Inbox className="h-4 w-4 text-ink-faint" />
        <p className="text-xs text-ink-faint">{emptyLabel}</p>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 rounded-lg border border-bad/20 bg-bad/5 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bad" />
          <p className="text-xs leading-relaxed text-ink-dim">{state.message}</p>
        </div>
        {state.stale !== undefined && children(state.stale, true)}
      </div>
    );
  }
  return <>{children(state.data, false)}</>;
}
