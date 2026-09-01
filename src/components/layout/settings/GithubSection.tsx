import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UserSettings } from "@/types";
import { Field, SectionHeading, TextInput } from "@/components/common/FormControls";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function GithubSection({ settings, update }: Props) {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>GitHub</SectionHeading>

      <Field label="Username">
        <TextInput
          value={settings.githubUsername}
          onChange={(e) => update({ githubUsername: e.target.value })}
          placeholder="octocat"
        />
      </Field>

      <Field
        label="Personal access token"
        hint="Optional. Needed only for the full contribution calendar and streak — stored locally in this browser, never in the extension's code."
      >
        <div className="relative">
          <TextInput
            type={showToken ? "text" : "password"}
            value={settings.githubToken}
            onChange={(e) => update({ githubToken: e.target.value })}
            placeholder="ghp_..."
            className="pr-9"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowToken((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label={showToken ? "Hide token" : "Show token"}
          >
            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <p className="text-xs leading-relaxed text-ink-faint">
        Create a fine-grained token with read-only access at{" "}
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          github.com/settings/tokens
        </a>
        . Without a token, the widget still shows your public profile stats.
      </p>
    </div>
  );
}
