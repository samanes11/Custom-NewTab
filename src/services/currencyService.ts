import { API_CONFIG } from "@/config";
import type { CurrencyQuote } from "@/types";

const CRYPTO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
};

const LABELS: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

function extractTomanPrice(json: any): number | null {
  const price = json?.data?.currencies?.USDT?.price;

  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsed = Number(price.replace(/,/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  console.warn(
    "[Currency] Unexpected Tetherland response — inspect this payload:",
    json
  );

  return null;
}

/**
 * قیمت ۱ تتر / دلار به ریال
 *
 * Tetherland قیمت USDT را به تومان برمی‌گرداند.
 * برای تبدیل تومان به ریال × ۱۰ می‌کنیم.
 */
async function fetchUsdToRial(): Promise<number> {
  const res = await fetch(API_CONFIG.currency.tetherland);

  if (!res.ok) {
    throw new Error(`Tetherland API error (${res.status})`);
  }

  const json = await res.json();

  if (json?.status !== 200) {
    throw new Error("Tetherland API returned an invalid status");
  }

  const usdtToman = extractTomanPrice(json);

  if (usdtToman == null) {
    throw new Error("Couldn't read USDT price from Tetherland");
  }

  // تومان → ریال
  return usdtToman * 1;
}

/**
 * یورو / پوند را با نرخ صلیبی USD
 * و قیمت دلار از Tetherland به ریال تبدیل می‌کند.
 */
async function fetchFiatInRial(
  symbols: string[]
): Promise<CurrencyQuote[]> {
  if (symbols.length === 0) return [];

  const usdToRial = await fetchUsdToRial();
  const now = Date.now();

  const others = symbols.filter((s) => s !== "USD");

  const usdPerUnit: Record<string, number> = {};

  if (others.length > 0) {
    const url = `${API_CONFIG.currency.fiat}/latest?base=USD&symbols=${others.join(
      ","
    )}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Exchange rate API error (${res.status})`);
    }

    const json: { rates: Record<string, number> } = await res.json();

    for (const sym of others) {
      const usdRate = json.rates?.[sym];

      if (
        typeof usdRate === "number" &&
        Number.isFinite(usdRate) &&
        usdRate > 0
      ) {
        // Frankfurter: مثلا 1 USD = 0.85 EUR
        // پس 1 EUR = 1 / 0.85 USD
        usdPerUnit[sym] = 1 / usdRate;
      }
    }
  }

  return symbols
    .map((sym): CurrencyQuote | null => {
      if (sym === "USD") {
        return {
          symbol: "USD",
          label: LABELS.USD,
          price: usdToRial,
          changePercent: null,
          unit: "T",
          updatedAt: now,
        };
      }

      const rate = usdPerUnit[sym];

      if (rate == null) {
        return null;
      }

      return {
        symbol: sym,
        label: LABELS[sym] ?? sym,
        price: rate * usdToRial,
        changePercent: null,
        unit: "T",
        updatedAt: now,
      };
    })
    .filter((q): q is CurrencyQuote => q !== null);
}

/**
 * قیمت ارزهای دیجیتال از CoinGecko
 */
async function fetchCrypto(
  base: string,
  symbols: string[]
): Promise<CurrencyQuote[]> {
  const ids = symbols
    .map((s) => CRYPTO_IDS[s])
    .filter(Boolean);

  if (ids.length === 0) return [];

  const vs = base.toLowerCase();

  const url =
    `${API_CONFIG.currency.crypto}` +
    `?ids=${ids.join(",")}` +
    `&vs_currencies=${vs}` +
    `&include_24hr_change=true`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Crypto price API error (${res.status})`);
  }

  const json: Record<string, Record<string, number>> =
    await res.json();

  const now = Date.now();

  return symbols
    .filter(
      (s) =>
        CRYPTO_IDS[s] &&
        json[CRYPTO_IDS[s]]
    )
    .map((s) => {
      const entry = json[CRYPTO_IDS[s]];

      return {
        symbol: s,
        label: LABELS[s] ?? s,
        price: entry[vs],
        changePercent:
          entry[`${vs}_24h_change`] ?? null,
        unit: base,
        updatedAt: now,
      };
    });
}

export async function fetchCurrencyQuotes(
  base: string,
  symbols: string[]
): Promise<CurrencyQuote[]> {
  const fiatSymbols = symbols.filter(
    (s) => LABELS[s] && !CRYPTO_IDS[s]
  );

  const cryptoSymbols = symbols.filter(
    (s) => CRYPTO_IDS[s]
  );

  const [fiatResult, cryptoResult] =
    await Promise.allSettled([
      fetchFiatInRial(fiatSymbols),
      fetchCrypto(base, cryptoSymbols),
    ]);

  const quotes: CurrencyQuote[] = [];

  if (fiatResult.status === "fulfilled") {
    quotes.push(...fiatResult.value);
  }

  if (cryptoResult.status === "fulfilled") {
    quotes.push(...cryptoResult.value);
  }

  if (quotes.length === 0) {
    const reason =
      fiatResult.status === "rejected"
        ? fiatResult.reason
        : cryptoResult.status === "rejected"
          ? cryptoResult.reason
          : undefined;

    throw new Error(
      reason instanceof Error
        ? reason.message
        : "Currency data unavailable"
    );
  }

  return symbols
    .map((s) =>
      quotes.find((q) => q.symbol === s)
    )
    .filter(
      (q): q is CurrencyQuote => q !== undefined
    );
}
