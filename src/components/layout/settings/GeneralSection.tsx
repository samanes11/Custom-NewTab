import type { UserSettings } from "@/types";
import { Field, SectionHeading, SegmentedControl, TextInput } from "@/components/common/FormControls";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function GeneralSection({ settings, update }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>General</SectionHeading>

      <Field label="Your name" hint="Used in the header greeting.">
        <TextInput
          value={settings.userName}
          onChange={(e) => update({ userName: e.target.value })}
          placeholder="Developer"
        />
      </Field>

      <Field label="Theme">
        <SegmentedControl
          value={settings.theme}
          onChange={(theme) => update({ theme })}
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
            { value: "system", label: "System" },
          ]}
        />
      </Field>

      <Field label="Search engine">
        <SegmentedControl
          value={settings.searchEngine}
          onChange={(searchEngine) => update({ searchEngine })}
          options={[
            { value: "google", label: "Google" },
            { value: "bing", label: "Bing" },
            { value: "duckduckgo", label: "DuckDuckGo" },
          ]}
        />
      </Field>
    </div>
  );
}
