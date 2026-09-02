import { CloudSun, Droplets, MapPin, Wind } from "lucide-react";
import { WidgetFrame, StateView } from "@/components/common/WidgetFrame";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { fetchWeather } from "@/services/weatherService";
import { iconForWeatherCode } from "@/utils/weatherIcons";
import { REFRESH_INTERVALS } from "@/config";
import type { WeatherData } from "@/types";

interface Props {
  city: string;
  useGeolocation: boolean;
}

export function WeatherWidget({ city, useGeolocation }: Props) {
  const { state } = useAsyncResource<WeatherData>(
    `weather:${city}:${useGeolocation}`,
    () => fetchWeather(city, useGeolocation),
    [city, useGeolocation],
    { intervalMs: REFRESH_INTERVALS.weather, enabled: useGeolocation || !!city.trim() },
  );

  return (
    <WidgetFrame icon={CloudSun} title="Weather">
      <StateView state={state} emptyLabel="Set a city or allow location access in Settings" skeletonLines={3}>
        {(weather, stale) => {
          const Icon = iconForWeatherCode(weather.code);
          return (
            <div className={stale ? "opacity-70" : ""}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-9 w-9 text-accent" strokeWidth={1.5} />
                  <div>
                    <span className="tabular text-4xl font-semibold leading-none text-ink">
                      {weather.temperatureC}°
                    </span>
                    <p className="mt-1 text-xs text-ink-faint">{weather.condition}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-ink-faint">
                  <p className="flex items-center justify-end gap-1">
                    <MapPin className="h-3 w-3" /> {weather.locationName}
                  </p>
                  <p className="mt-1 tabular">
                    H:{weather.tempMaxC}° L:{weather.tempMinC}°
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-surface-border pt-3 text-xs text-ink-faint">
                <span>
                  Feels like <span className="tabular text-ink-dim">{weather.feelsLikeC}°</span>
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> {weather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3" /> {weather.windKph} km/h
                </span>
              </div>

              {weather.forecast.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {weather.forecast.map((d, i) => {
                    const DayIcon = iconForWeatherCode(d.code);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 py-1 text-center">
                        <span className="text-[11px] text-ink-faint">{d.day}</span>
                        <DayIcon className="h-4 w-4 text-ink-dim" strokeWidth={1.5} />
                        <span className="tabular text-xs font-medium text-ink">
                          {d.maxC}° <span className="text-ink-faint">/ {d.minC}°</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      </StateView>
    </WidgetFrame>
  );
}