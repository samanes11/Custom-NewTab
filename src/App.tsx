import { useState } from "react";
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
import { WIDGET_REGISTRY } from "@/config";
import type { WidgetId, WidgetLayout } from "@/types";
import { ClockHero } from "@/components/layout/ClockHero";
import { FreeWidget } from "@/components/layout/FreeWidget";
import { MotionConfig } from "motion/react";

export default function App() {
  const { settings, update, loaded } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const enabledWidgets = settings.widgetOrder.filter((id) => settings.widgetEnabled[id]);

  function updateLayout(id: WidgetId, layout: WidgetLayout) {
    update({ widgetLayout: { ...settings.widgetLayout, [id]: layout } });
  }

  function bringToFront(id: WidgetId) {
    const rest = settings.widgetOrder.filter((w) => w !== id);
    update({ widgetOrder: [...rest, id] });
  }

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
        </div>

        <div className="relative mx-6 mb-6 min-h-[620px] sm:mx-10 lg:mx-16">
          {enabledWidgets.map((id, index) => {
            const meta = WIDGET_REGISTRY.find((w) => w.id === id);
            const layout = settings.widgetLayout[id] ?? meta?.defaultLayout;
            if (!meta || !layout) return null;
            return (
              <FreeWidget
                key={id}
                layout={layout}
                minW={meta.minW}
                minH={meta.minH}
                zIndex={10 + index}
                onFocus={() => bringToFront(id)}
                onChange={(next) => updateLayout(id, next)}
              >
                <WidgetErrorBoundary label={meta.label}>{renderWidget(id)}</WidgetErrorBoundary>
              </FreeWidget>
            );
          })}
        </div>

        <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} update={update} />
      </div>
    </MotionConfig>
  );
}