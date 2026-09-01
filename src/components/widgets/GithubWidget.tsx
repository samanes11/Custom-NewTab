import { ExternalLink, Flame, Github } from "lucide-react";
import { WidgetFrame, StateView } from "@/components/common/WidgetFrame";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { fetchGithubProfile } from "@/services/githubService";
import { REFRESH_INTERVALS } from "@/config";
import type { GithubProfile } from "@/types";

interface Props {
  username: string;
  token: string;
}

const LEVEL_COLORS = [
  "bg-surface-hover",
  "bg-accent-dim",
  "bg-accent/60",
  "bg-accent",
  "bg-amber",
];

export function GithubWidget({ username, token }: Props) {
  const { state } = useAsyncResource<GithubProfile>(
    `github:${username}:${token ? "auth" : "public"}`,
    () => fetchGithubProfile(username, token),
    [username, token],
    { intervalMs: REFRESH_INTERVALS.github, enabled: !!username.trim() },
  );

  return (
    <WidgetFrame
      icon={Github}
      title="GitHub"
      className="sm:col-span-2"
      action={
        username && (
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="text-ink-faint transition-colors hover:text-ink"
            aria-label="Open GitHub profile"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )
      }
    >
      <StateView state={state} emptyLabel="Add your GitHub username in Settings" skeletonLines={4}>
        {(profile, stale) => (
          <div className={stale ? "opacity-70" : ""}>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full border border-surface-border"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{profile.username}</p>
                <p className="text-xs text-ink-faint">
                  {profile.followers} followers · {profile.publicRepos} repos
                </p>
              </div>
            </div>

            {profile.hasFullData && profile.weeks ? (
              <>
                <div className="mb-3 flex gap-3 overflow-x-auto pb-1">
                  <div className="flex gap-[3px]">
                    {profile.weeks.map((week, wi) => (
                      <div key={wi} className="grid grid-rows-7 gap-[3px]">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            title={`${day.count} contributions on ${day.date}`}
                            className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-ink-dim">
                    <span className="tabular font-medium text-ink">{profile.totalContributions}</span> this year
                  </span>
                  <span className="text-ink-dim">
                    <span className="tabular font-medium text-ink">{profile.todayContributions}</span> today
                  </span>
                  {!!profile.currentStreak && (
                    <span className="flex items-center gap-1 text-amber">
                      <Flame className="h-3 w-3" />
                      <span className="tabular font-medium">{profile.currentStreak}</span> day streak
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-ink-faint">
                Add a personal access token in Settings → GitHub to see your contribution calendar and streak.
              </p>
            )}
          </div>
        )}
      </StateView>
    </WidgetFrame>
  );
}
