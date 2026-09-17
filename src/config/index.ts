import type { UserSettings, WidgetId, WidgetLayout, WidgetMeta } from "@/types";

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    id: "github",
    label: "GitHub",
    description: "Contribution graph & activity",
    defaultEnabled: true,
    defaultLayout: { x: 0, y: 0, w: 600, h: 280 },
    minW: 280,
    minH: 140,
  },
  {
    id: "currency",
    label: "Currency",
    description: "Live exchange & crypto rates",
    defaultEnabled: true,
    defaultLayout: { x: 620, y: 0, w: 280, h: 280 },
    minW: 180,
    minH: 110,
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Monthly calendar",
    defaultEnabled: true,
    defaultLayout: { x: 920, y: 0, w: 280, h: 280 },
    minW: 160,
    minH: 70,
  },
  {
    id: "weather",
    label: "Weather",
    description: "Local conditions",
    defaultEnabled: true,
    defaultLayout: { x: 0, y: 300, w: 280, h: 280 },
    minW: 160,
    minH: 90,
  },
  {
    id: "quickLinks",
    label: "Quick Links",
    description: "Shortcuts to your tools",
    defaultEnabled: true,
    defaultLayout: { x: 300, y: 300, w: 280, h: 280 },
    minW: 180,
    minH: 140,
  },
  {
    id: "serverStatus",
    label: "Server Status",
    description: "Uptime of your services",
    defaultEnabled: false,
    defaultLayout: { x: 600, y: 300, w: 280, h: 280 },
    minW: 180,
    minH: 100,
  },
];

export const DEFAULT_WIDGET_ORDER: WidgetId[] = WIDGET_REGISTRY.map((w) => w.id);

export const DEFAULT_WIDGET_ENABLED: Record<WidgetId, boolean> = WIDGET_REGISTRY.reduce(
  (acc, w) => {
    acc[w.id] = w.defaultEnabled;
    return acc;
  },
  {} as Record<WidgetId, boolean>,
);

export const DEFAULT_WIDGET_LAYOUT: Record<WidgetId, WidgetLayout> = WIDGET_REGISTRY.reduce(
  (acc, w) => {
    acc[w.id] = w.defaultLayout;
    return acc;
  },
  {} as Record<WidgetId, WidgetLayout>,
);

export const API_CONFIG = {
  github: {
    rest: "https://api.github.com",
    graphql: "https://api.github.com/graphql",
  },
  currency: {
    fiat: "https://api.frankfurter.dev/v1",
    crypto: "https://api.coingecko.com/api/v3/simple/price",
    tetherland: "https://api.tetherland.com/currencies",
  },
  weather: {
    forecast: "https://api.open-meteo.com/v1/forecast",
    geocoding: "https://geocoding-api.open-meteo.com/v1/search",
  },
};

export const REFRESH_INTERVALS = {
  github: 10 * 60 * 1000,
  currency: 2 * 60 * 1000,
  weather: 15 * 60 * 1000,
  serverStatus: 60 * 1000,
};

export const CURRENCY_SYMBOLS = {
  fiat: ["EUR", "GBP"],
  crypto: ["BTC", "ETH"],
  base: "USD",
};

export const DEFAULT_BACKGROUND_IMAGE = "/backgrounds/default.jpg";

export const DEFAULT_SETTINGS: UserSettings = {
  userName: "Developer",
  theme: "dark",

  githubUsername: "",
  githubToken: "",

  currencyBase: "USD",
  currencyTargets: ["USD", "EUR", "GBP", "BTC", "ETH"],

  weatherCity: "",
  weatherUseGeolocation: true,

  widgetOrder: DEFAULT_WIDGET_ORDER,
  widgetEnabled: DEFAULT_WIDGET_ENABLED,
  widgetLayout: DEFAULT_WIDGET_LAYOUT,

  backgroundImage: DEFAULT_BACKGROUND_IMAGE,

  quickLinks: [
    { id: "l1", title: "GitHub", url: "https://github.com" },
    { id: "l2", title: "Cloudflare", url: "https://dash.cloudflare.com" },
    { id: "l3", title: "Railway", url: "https://railway.app" },
    { id: "l4", title: "Vercel", url: "https://vercel.com" },
    { id: "l5", title: "Sentry", url: "https://sentry.io" },
    { id: "l6", title: "Telegram", url: "https://web.telegram.org" },
    { id: "l7", title: "MongoDB", url: "https://cloud.mongodb.com" },
  ],

  serverStatusItems: [],
};