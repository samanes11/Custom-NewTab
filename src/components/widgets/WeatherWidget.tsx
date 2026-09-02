import { CloudSun, Droplets, MapPin, Wind } from "lucide-react";
import { WidgetFrame, StateView } from "@/components/common/WidgetFrame";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { fetchWeather } from "@/services/weatherService";
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
        {(weather, stale) => (
          <div className={stale ? "opacity-70" : ""}>
            <div className="mb-1 flex items-end justify-between">
              <span className="tabular text-3xl font-semibold text-ink">{weather.temperatureC}°</span>
              <span className="text-sm text-ink-dim">{weather.condition}</span>
            </div>

            <p className="mb-3 text-xs tabular text-ink-faint">
              Feels like {weather.feelsLikeC}° · H:{weather.tempMaxC}° L:{weather.tempMinC}°
            </p>

            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-faint">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {weather.locationName}</span>
              <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {weather.humidity}%</span>
              <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> {weather.windKph} km/h</span>
            </div>

            {weather.forecast.length > 0 && (
              <div className="grid grid-cols-3 gap-2 border-t border-surface-border pt-3">
                {weather.forecast.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] text-ink-faint">{d.day}</span>
                    <span className="tabular text-xs font-medium text-ink">{d.maxC}°</span>
                    <span className="tabular text-[11px] text-ink-faint">{d.minC}°</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </StateView>
    </WidgetFrame>
  );
}
