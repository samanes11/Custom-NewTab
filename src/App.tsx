import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/layout/SearchBar";
import { SettingsDrawer } from "@/components/layout/SettingsDrawer";
import { WidgetErrorBoundary } from "@/components/common/WidgetErrorBoundary";
import { GithubWidget } from "@/components/widgets/GithubWidget";
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";
import { ProjectsWidget } from "@/components/widgets/ProjectsWidget";
import { FocusWidget } from "@/components/widgets/FocusWidget";
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
      case "calendar":
        return <CalendarWidget />;
      case "weather":
        return <WeatherWidget city={settings.weatherCity} useGeolocation={settings.weatherUseGeolocation} />;
      case "quickLinks":
        return <QuickLinksWidget links={settings.quickLinks} />;
      case "projects":
        return <ProjectsWidget projects={settings.projects} />;
      case "focus":
        return <FocusWidget focusMinutes={settings.focusMinutes} breakMinutes={settings.breakMinutes} />;
      case "serverStatus":
        return <ServerStatusWidget items={settings.serverStatusItems} />;
      default:
        return null;
    }
  }

  // Avoid a default-settings flash before storage has finished loading.
  if (!loaded) {
    return <div className="min-h-screen bg-base" />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Header userName={settings.userName} onOpenSettings={() => setSettingsOpen(true)} />
        <SearchBar engine={settings.searchEngine} />

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
