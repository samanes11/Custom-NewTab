import { API_CONFIG } from "@/config";
import type { GithubContributionDay, GithubProfile } from "@/types";

interface GraphQLContributionResponse {
  data?: {
    user?: {
      avatarUrl: string;
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              weekday: number;
            }[];
          }[];
        };
      };
      repositories: { totalCount: number };
      followers: { totalCount: number };
    };
  };
  errors?: { message: string }[];
}

function levelFor(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max <= 0) return 1;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

function computeStreak(days: GithubContributionDay[]): number {
  let streak = 0;
  // Walk backwards from the most recent day; a gap ends the streak.
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else break;
  }
  return streak;
}

async function fetchViaGraphQL(username: string, token: string): Promise<GithubProfile> {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        avatarUrl
        repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
        followers { totalCount }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(API_CONFIG.github.graphql, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) throw new Error(`GitHub GraphQL error (${res.status})`);
  const json: GraphQLContributionResponse = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  const user = json.data?.user;
  if (!user) throw new Error("GitHub user not found");

  const calendar = user.contributionsCollection.contributionCalendar;
  const allDays = calendar.weeks.flatMap((w) => w.contributionDays);
  const maxCount = Math.max(1, ...allDays.map((d) => d.contributionCount));

  const flatDays: GithubContributionDay[] = allDays.map((d) => ({
    date: d.date,
    count: d.contributionCount,
    level: levelFor(d.contributionCount, maxCount),
  }));

  const weeks: GithubContributionDay[][] = calendar.weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: levelFor(d.contributionCount, maxCount),
    })),
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = flatDays.find((d) => d.date === todayStr);

  return {
    username,
    avatarUrl: user.avatarUrl,
    profileUrl: `https://github.com/${username}`,
    totalContributions: calendar.totalContributions,
    todayContributions: today?.count ?? 0,
    currentStreak: computeStreak(flatDays),
    weeks,
    publicRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    hasFullData: true,
  };
}

interface RestUser {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
}

/** Public REST fallback: no contribution calendar available without auth,
 * so the widget shows profile stats and is upfront about the limitation. */
async function fetchViaRest(username: string): Promise<GithubProfile> {
  const res = await fetch(`${API_CONFIG.github.rest}/users/${encodeURIComponent(username)}`);
  if (res.status === 404) throw new Error(`No GitHub user named "${username}"`);
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  const user: RestUser = await res.json();

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    totalContributions: null,
    todayContributions: null,
    currentStreak: null,
    weeks: null,
    publicRepos: user.public_repos,
    followers: user.followers,
    hasFullData: false,
  };
}

export async function fetchGithubProfile(username: string, token?: string): Promise<GithubProfile> {
  if (!username.trim()) throw new Error("No GitHub username configured");
  if (token && token.trim()) {
    return fetchViaGraphQL(username.trim(), token.trim());
  }
  return fetchViaRest(username.trim());
}
