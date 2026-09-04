import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SettingsDrawer } from "@/components/layout/SettingsDrawer";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { WidgetErrorBoundary } from "@/components/common/WidgetErrorBoundary";
import { GithubWidget } from "@/components/widgets/GithubWidget";
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";
import { ServerStatusWidget } from "@/components/widgets/ServerStatusWidget";
import { useSettings } from "@/hooks/useSettings";
import { useDragReorder } from "@/hooks/useDragReorder";
import { WIDGET_REGISTRY } from "@/config";
import type { WidgetId } from "@/types";
import { ClockHero } from "@/components/layout/ClockHero";
import { MotionConfig } from "motion/react";


function mergeWidgetOrder(fullOrder: WidgetId[], enabledNewOrder: WidgetId[]): WidgetId[] {
  const enabledSet = new Set(enabledNewOrder);
  let i = 0;
  return fullOrder.map((id) => (enabledSet.has(id) ? enabledNewOrder[i++] : id));
}

export default function App() {
  const { settings, update, loaded } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const enabledOrderedWidgets = useMemo(
    () => settings.widgetOrder.filter((id) => settings.widgetEnabled[id]),
    [settings.widgetOrder, settings.widgetEnabled],
  );

  const { getItemProps } = useDragReorder(enabledOrderedWidgets, (next) =>
    update({ widgetOrder: mergeWidgetOrder(settings.widgetOrder, next) }),
  );

  function renderWidget(id: WidgetId) {
    switch (id) {
      case "github":
        return <GithubWidget settings={settings} update={update} />;
      case "currency":
        return <CurrencyWidget settings={settings} update={update} />;
      case "weather":
        return <WeatherWidget settings={settings} update={update} />;
      case "quickLinks":
        return <QuickLinksWidget links={settings.quickLinks} onChange={(quickLinks) => update({ quickLinks })} />;
      case "serverStatus":
        return <ServerStatusWidget settings={settings} update={update} />;
      case "calendar":
        return <CalendarWidget />;
      default:
        return null;
    }
  }

  if (!loaded) return <div className="min-h-screen bg-base" />;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <div
          className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${settings.backgroundImage})` }}
        />
        <div className="fixed inset-0 -z-10 bg-black/45" />

        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-4 pt-3 sm:px-10 lg:px-16">
          <Header onOpenSettings={() => setSettingsOpen(true)} />
          <ClockHero userName={settings.userName} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {enabledOrderedWidgets.map((id, index) => {
              const meta = WIDGET_REGISTRY.find((w) => w.id === id);
              const { isDragging, isOver, ...dragProps } = getItemProps(index);
              return (
                <div
                  key={id}
                  {...dragProps}
                  className={`cursor-grab transition-all duration-150 ease-spring-bounce active:cursor-grabbing ${meta?.gridClassName ?? ""} ${isDragging ? "scale-[0.97] opacity-40" : ""
                    } ${isOver ? "scale-[1.01] rounded-card ring-2 ring-accent/60" : ""}`}
                >
                  <WidgetErrorBoundary label={meta?.label ?? "Widget"}>{renderWidget(id)}</WidgetErrorBoundary>
                </div>
              );
            })}
          </div>
        </div>

        <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} update={update} />
      </div>
    </MotionConfig>
  );
}