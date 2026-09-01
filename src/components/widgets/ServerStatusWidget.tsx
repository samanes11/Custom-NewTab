import { Activity } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import type { ServerStatusItem } from "@/types";

interface Props {
  items: ServerStatusItem[];
}

const STATE_STYLES: Record<ServerStatusItem["state"], string> = {
  online: "bg-good",
  degraded: "bg-amber",
  offline: "bg-bad",
};

const STATE_LABELS: Record<ServerStatusItem["state"], string> = {
  online: "Online",
  degraded: "Degraded",
  offline: "Offline",
};

export function ServerStatusWidget({ items }: Props) {
  return (
    <WidgetFrame icon={Activity} title="Server Status">
      {items.length === 0 ? (
        <p className="py-4 text-center text-xs text-ink-faint">No services configured yet</p>
      ) : (
        <ul className="flex flex-col divide-y divide-surface-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
              <span className="text-sm text-ink">{item.label}</span>
              <span className="flex items-center gap-1.5 text-xs text-ink-dim">
                <span className={`h-1.5 w-1.5 rounded-full ${STATE_STYLES[item.state]}`} />
                {STATE_LABELS[item.state]}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
        Backed by configuration for now — point{" "}
        <code className="rounded bg-surface-hover px-1 py-0.5">serverStatusItems</code> at real health-check
        endpoints when you're ready.
      </p>
    </WidgetFrame>
  );
}
