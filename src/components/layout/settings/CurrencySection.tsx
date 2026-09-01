import type { UserSettings } from "@/types";
import { SectionHeading, Toggle } from "@/components/common/FormControls";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

const AVAILABLE = ["EUR", "GBP", "BTC", "ETH"];

export function CurrencySection({ settings, update }: Props) {
  function toggleSymbol(symbol: string, on: boolean) {
    const withoutBase = settings.currencyTargets.filter((s) => s !== "USD");
    const next = on ? [...withoutBase, symbol] : withoutBase.filter((s) => s !== symbol);
    update({ currencyTargets: ["USD", ...next] });
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading>Currency</SectionHeading>

      <p className="text-xs leading-relaxed text-ink-faint">
        Base currency is fixed to USD, sourced from Frankfurter (fiat, ECB rates) and CoinGecko (crypto) — both
        free and keyless. Swap providers in{" "}
        <code className="rounded bg-surface-hover px-1 py-0.5">src/services/currencyService.ts</code> if you need
        something else.
      </p>

      <div className="flex flex-col divide-y divide-surface-border">
        {AVAILABLE.map((symbol) => (
          <Toggle
            key={symbol}
            label={symbol}
            checked={settings.currencyTargets.includes(symbol)}
            onChange={(v) => toggleSymbol(symbol, v)}
          />
        ))}
      </div>
    </div>
  );
}
