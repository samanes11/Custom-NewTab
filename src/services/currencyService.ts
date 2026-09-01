import { API_CONFIG } from "@/config";
import type { CurrencyQuote } from "@/types";

const CRYPTO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
};

const LABELS: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

/**
 * Fiat rates via Frankfurter (ECB data, no key). Returns 1 unit of `base`
 * expressed in each of `symbols`.
 */
async function fetchFiat(base: string, symbols: string[]): Promise<CurrencyQuote[]> {
  if (symbols.length === 0) return [];
  const url = `${API_CONFIG.currency.fiat}/latest?base=${base}&symbols=${symbols.join(",")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Exchange rate API error (${res.status})`);
  const json: { rates: Record<string, number> } = await res.json();
  const now = Date.now();
  return symbols
    .filter((s) => json.rates[s] != null)
    .map((s) => ({
      symbol: s,
      label: LABELS[s] ?? s,
      price: json.rates[s],
      changePercent: null, // Frankfurter's free tier has no % change field.
      unit: base,
      updatedAt: now,
    }));
}

/** Crypto quotes via CoinGecko's simple price endpoint (no key), including 24h change. */
async function fetchCrypto(base: string, symbols: string[]): Promise<CurrencyQuote[]> {
  const ids = symbols.map((s) => CRYPTO_IDS[s]).filter(Boolean);
  if (ids.length === 0) return [];
  const vs = base.toLowerCase();
  const url = `${API_CONFIG.currency.crypto}?ids=${ids.join(",")}&vs_currencies=${vs}&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Crypto price API error (${res.status})`);
  const json: Record<string, Record<string, number>> = await res.json();
  const now = Date.now();
  return symbols
    .filter((s) => CRYPTO_IDS[s] && json[CRYPTO_IDS[s]])
    .map((s) => {
      const entry = json[CRYPTO_IDS[s]];
      return {
        symbol: s,
        label: LABELS[s] ?? s,
        price: entry[vs],
        changePercent: entry[`${vs}_24h_change`] ?? null,
        unit: base,
        updatedAt: now,
      };
    });
}

/**
 * Fetches every configured currency in parallel. One provider failing
 * (say, crypto) doesn't take down the other — whichever succeeds is
 * returned, and the caller decides how to render a partial result.
 */
export async function fetchCurrencyQuotes(base: string, symbols: string[]): Promise<CurrencyQuote[]> {
  const fiatSymbols = symbols.filter((s) => s !== base && LABELS[s] && !CRYPTO_IDS[s]);
  const cryptoSymbols = symbols.filter((s) => CRYPTO_IDS[s]);

  const [fiatResult, cryptoResult] = await Promise.allSettled([
    fetchFiat(base, fiatSymbols),
    fetchCrypto(base, cryptoSymbols),
  ]);

  const quotes: CurrencyQuote[] = [];
  if (fiatResult.status === "fulfilled") quotes.push(...fiatResult.value);
  if (cryptoResult.status === "fulfilled") quotes.push(...cryptoResult.value);

  if (quotes.length === 0) {
    const reason =
      fiatResult.status === "rejected" ? fiatResult.reason : cryptoResult.status === "rejected" ? cryptoResult.reason : undefined;
    throw new Error(reason instanceof Error ? reason.message : "Currency data unavailable");
  }

  // Preserve the order the user configured.
  return symbols
    .map((s) => quotes.find((q) => q.symbol === s))
    .filter((q): q is CurrencyQuote => !!q);
}
