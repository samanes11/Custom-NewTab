import type { UserSettings } from "@/types";
import { Field, SectionHeading, TextInput, Toggle } from "@/components/common/FormControls";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function WeatherSection({ settings, update }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>Weather</SectionHeading>

      <Toggle
        label="Use my current location"
        checked={settings.weatherUseGeolocation}
        onChange={(v) => update({ weatherUseGeolocation: v })}
      />

      <Field
        label="City"
        hint={settings.weatherUseGeolocation ? "Used as a fallback if location access is denied." : "Used to look up weather."}
      >
        <TextInput
          value={settings.weatherCity}
          onChange={(e) => update({ weatherCity: e.target.value })}
          placeholder="Baku"
        />
      </Field>
    </div>
  );
}
