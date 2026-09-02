import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function iconForWeatherCode(code: number): LucideIcon {
    if (code === 0) return Sun;
    if (code === 1 || code === 2) return CloudSun;
    if (code === 3) return Cloud;
    if (code === 45 || code === 48) return CloudFog;
    if (code === 51 || code === 53 || code === 55) return CloudDrizzle;
    if ([61, 63, 65, 80, 81, 82].includes(code)) return CloudRain;
    if ([71, 73, 75].includes(code)) return CloudSnow;
    if ([95, 96, 99].includes(code)) return CloudLightning;
    return CloudSun;
}