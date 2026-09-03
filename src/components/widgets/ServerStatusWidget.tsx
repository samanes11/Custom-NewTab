import { Activity, RefreshCw } from "lucide-react";
import { WidgetFrame, StateView } from "@/components/common/WidgetFrame";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { checkAllServerStatuses } from "@/services/serverStatusService";
import { REFRESH_INTERVALS } from "@/config";
import { ServerStatusSection } from "@/components/layout/settings/ServerStatusSection";
import type { ServerStatusState, UserSettings } from "@/types";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

const STATE_STYLES: Record<ServerStatusState, string> = { online: "bg-good", degraded: "bg-amber", offline: "bg-bad" };
const STATE_LABELS: Record<ServerStatusState, string> = { online: "Online", degraded: "Unknown", offline: "Offline" };

export function ServerStatusWidget({ settings, update }: Props) {
  const items = settings.serverStatusItems;
  const itemsKey = JSON.stringify(items);

  const { state, refetch } = useAsyncResource<Record<string, ServerStatusState>>(
    `serverStatus:${itemsKey}`,
    () => checkAllServerStatuses(items),
    [itemsKey],
    { intervalMs: REFRESH_INTERVALS.serverStatus, enabled: items.length > 0 },
  );

  return (
    <WidgetFrame
      icon={Activity}
      title="Server Status"
      settings={<ServerStatusSection settings={settings} update={update} />}
      action={
        items.length > 0 && (
          <button onClick={refetch} aria-label="Refresh" className="text-ink-faint transition-colors hover:text-ink">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )
      }
    >
      <StateView state={state} emptyLabel="Add a service in Settings → Server Status" skeletonLines={3}>
        {(statuses, stale) => (
          <ul className={`flex flex-col divide-y divide-surface-border ${stale ? "opacity-70" : ""}`}>
            {items.map((item) => {
              const s = statuses[item.id] ?? "degraded";
              return (
                <li key={item.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-sm text-ink">{item.label}</span>
                  <span className="flex items-center gap-1.5 text-xs text-ink-dim">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATE_STYLES[s]}`} />
                    {STATE_LABELS[s]}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </StateView>
    </WidgetFrame>
  );
}