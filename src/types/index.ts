// ---------- Widgets ----------

export type WidgetId =
  | "github"
  | "currency"
  | "calendar"
  | "weather"
  | "quickLinks"
  | "serverStatus";

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetMeta {
  id: WidgetId;
  label: string;
  description: string;
  defaultEnabled: boolean;
  defaultLayout: WidgetLayout;
  minW: number;
  minH: number;
}

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string; stale?: T }
  | { status: "empty" }
  | { status: "success"; data: T };

// ---------- Settings ----------

export type ThemeMode = "dark" | "light" | "system";

export interface QuickLink {
  id: string;
  title: string;
  url: string;
}

export type ServerStatusState = "online" | "offline" | "degraded";

export interface ServerStatusItem {
  id: string;
  label: string;
  url: string;
  jsonPath?: string;
  healthyValue: string;
  unhealthyValue: string;
}

export interface UserSettings {
  userName: string;
  theme: ThemeMode;

  backgroundImage: string;

  githubUsername: string;
  githubToken: string;

  currencyBase: "USD";
  currencyTargets: string[];

  weatherCity: string;
  weatherUseGeolocation: boolean;

  widgetOrder: WidgetId[];
  widgetEnabled: Record<WidgetId, boolean>;
  widgetLayout: Record<WidgetId, WidgetLayout>;

  quickLinks: QuickLink[];
  serverStatusItems: ServerStatusItem[];
}

// ---------- GitHub ----------

export interface GithubContributionDay {
  date: string;
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
  hasFullData: boolean;
}

// ---------- Currency ----------

export interface CurrencyQuote {
  symbol: string;
  label: string;
  price: number;
  changePercent: number | null;
  unit: string;
  updatedAt: number;
}

// ---------- Weather ----------

export interface WeatherData {
  temperatureC: number;
  condition: string;
  code: number;
  humidity: number;
  windKph: number;
  locationName: string;
  feelsLikeC: number;
  tempMaxC: number;
  tempMinC: number;
  forecast: { day: string; code: number; maxC: number; minC: number }[];
}