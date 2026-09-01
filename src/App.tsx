import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { CalendarClockHero } from "@/components/layout/CalendarClockHero";
import { SettingsDrawer } from "@/components/layout/SettingsDrawer";
import { WidgetErrorBoundary } from "@/components/common/WidgetErrorBoundary";
import { GithubWidget } from "@/components/widgets/GithubWidget";
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";
import { ServerStatusWidget } from "@/components/widgets/ServerStatusWidget";
import { useSettings } from "@/hooks/useSettings";
import { WIDGET_REGISTRY } from "@/config";
import type { WidgetId } from "@/types";

export default function App() {
  const { settings, update, loaded } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const enabledOrderedWidgets = useMemo(
    () => settings.widgetOrder.filter((id) => settings.widgetEnabled[id]),
    [settings.widgetOrder, settings.widgetEnabled],
  );

  function renderWidget(id: WidgetId) {
    switch (id) {
      case "github":
        return <GithubWidget username={settings.githubUsername} token={settings.githubToken} />;
      case "currency":
        return <CurrencyWidget base={settings.currencyBase} targets={settings.currencyTargets} />;
      case "weather":
        return <WeatherWidget city={settings.weatherCity} useGeolocation={settings.weatherUseGeolocation} />;
      case "quickLinks":
        return <QuickLinksWidget links={settings.quickLinks} />;
      case "serverStatus":
        return <ServerStatusWidget items={settings.serverStatusItems} />;
      default:
        return null;
    }
  }

  if (!loaded) return <div className="min-h-screen bg-base" />;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${settings.backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45" />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-16">
        <Header userName={settings.userName} onOpenSettings={() => setSettingsOpen(true)} />
        <CalendarClockHero />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {enabledOrderedWidgets.map((id) => {
            const meta = WIDGET_REGISTRY.find((w) => w.id === id);
            return (
              <WidgetErrorBoundary key={id} label={meta?.label ?? "Widget"}>
                {renderWidget(id)}
              </WidgetErrorBoundary>
            );
          })}
        </div>
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} update={update} />
    </div>
  );
}