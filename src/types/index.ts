// ---------- Widgets ----------

export type WidgetId =
  | "github"
  | "currency"
  | "calendar"
  | "weather"
  | "quickLinks"
  | "projects"
  | "focus"
  | "serverStatus";

export interface WidgetMeta {
  id: WidgetId;
  label: string;
  description: string;
  /** Server status is opt-in by default since it needs real endpoints to be useful. */
  defaultEnabled: boolean;
}

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string; stale?: T }
  | { status: "empty" }
  | { status: "success"; data: T };

// ---------- Settings ----------

export type ThemeMode = "dark" | "light" | "system";
export type SearchEngine = "google" | "bing" | "duckduckgo";

export interface QuickLink {
  id: string;
  title: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  progress: number; // 0-100
}

export interface ServerStatusItem {
  id: string;
  label: string;
  state: "online" | "offline" | "degraded";
}

export interface UserSettings {
  userName: string;
  theme: ThemeMode;
  searchEngine: SearchEngine;

  githubUsername: string;
  githubToken: string;

  currencyBase: "USD";
  currencyTargets: string[];

  weatherCity: string;
  weatherUseGeolocation: boolean;

  focusMinutes: number;
  breakMinutes: number;

  widgetOrder: WidgetId[];
  widgetEnabled: Record<WidgetId, boolean>;

  quickLinks: QuickLink[];
  projects: Project[];
  serverStatusItems: ServerStatusItem[];
}

// ---------- GitHub ----------

export interface GithubContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubProfile {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  totalContributions: number | null;
  todayContributions: number | null;
  currentStreak: number | null;
  weeks: GithubContributionDay[][] | null;
  publicRepos: number;
  followers: number;
  hasFullData: boolean; // true when token-backed GraphQL data was used
}

// ---------- Currency ----------

export interface CurrencyQuote {
  symbol: string;
  label: string;
  price: number;
  changePercent: number | null;
  unit: string; // display currency, e.g. "USD"
  updatedAt: number;
}

// ---------- Weather ----------

export interface WeatherData {
  temperatureC: number;
  condition: string;
  humidity: number;
  windKph: number;
  locationName: string;
}
