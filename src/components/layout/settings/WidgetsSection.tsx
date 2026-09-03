import type { UserSettings, WidgetId } from "@/types";
import { WIDGET_REGISTRY } from "@/config";
import { SectionHeading, Toggle } from "@/components/common/FormControls";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function WidgetsSection({ settings, update }: Props) {
  function toggle(id: WidgetId, on: boolean) {
    update({ widgetEnabled: { ...settings.widgetEnabled, [id]: on } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionHeading>Widgets</SectionHeading>
        <p className="mt-1 text-xs text-ink-faint">
          Toggle to show or hide. Drag widgets directly on the dashboard to reorder them.
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {settings.widgetOrder.map((id) => {
          const meta = WIDGET_REGISTRY.find((w) => w.id === id);
          if (!meta) return null;
          return (
            <li key={id} className="rounded-lg px-2.5 py-2">
              <Toggle label={meta.label} checked={settings.widgetEnabled[id]} onChange={(v) => toggle(id, v)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}