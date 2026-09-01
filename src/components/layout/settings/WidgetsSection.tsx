import { GripVertical } from "lucide-react";
import type { UserSettings, WidgetId } from "@/types";
import { WIDGET_REGISTRY } from "@/config";
import { SectionHeading, Toggle } from "@/components/common/FormControls";
import { useDragReorder } from "@/hooks/useDragReorder";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function WidgetsSection({ settings, update }: Props) {
  const order = settings.widgetOrder;
  const { getItemProps } = useDragReorder(order, (next) => update({ widgetOrder: next }));

  function toggle(id: WidgetId, on: boolean) {
    update({ widgetEnabled: { ...settings.widgetEnabled, [id]: on } });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionHeading>Widgets</SectionHeading>
        <p className="mt-1 text-xs text-ink-faint">Drag to reorder. Toggle to show or hide.</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {order.map((id, index) => {
          const meta = WIDGET_REGISTRY.find((w) => w.id === id);
          if (!meta) return null;
          const { isDragging, isOver, ...dragProps } = getItemProps(index);
          return (
            <li
              key={id}
              {...dragProps}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors ${
                isOver ? "border-accent/60 bg-accent-soft" : "border-transparent"
              } ${isDragging ? "opacity-40" : "opacity-100"}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink-faint" />
              <div className="min-w-0 flex-1">
                <Toggle label={meta.label} checked={settings.widgetEnabled[id]} onChange={(v) => toggle(id, v)} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
