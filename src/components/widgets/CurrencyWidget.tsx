import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { WidgetFrame, StateView } from "@/components/common/WidgetFrame";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { fetchCurrencyQuotes } from "@/services/currencyService";
import { REFRESH_INTERVALS } from "@/config";
import { formatPrice, formatRelativeTime } from "@/utils/format";
import type { CurrencyQuote } from "@/types";

interface Props {
  base: string;
  targets: string[];
}

export function CurrencyWidget({ base, targets }: Props) {
  const { state } = useAsyncResource<CurrencyQuote[]>(
    `currency:${base}:${targets.join(",")}`,
    () => fetchCurrencyQuotes(base, targets),
    [base, targets.join(",")],
    { intervalMs: REFRESH_INTERVALS.currency, enabled: targets.length > 0 },
  );

  return (
    <WidgetFrame icon={DollarSign} title="Currency">
      <StateView state={state} emptyLabel="No currencies configured" skeletonLines={4}>
        {(quotes, stale) => (
          <ul className={`flex flex-col divide-y divide-surface-border ${stale ? "opacity-70" : ""}`}>
            {quotes.map((q) => (
              <li key={q.symbol} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-ink">{q.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="tabular text-sm text-ink-dim">
                    {q.symbol === "BTC" || q.symbol === "ETH" ? "$" : ""}
                    {formatPrice(q.price)}
                    {q.symbol !== "BTC" && q.symbol !== "ETH" ? ` ${q.unit}` : ""}
                  </span>
                  {q.changePercent != null && (
                    <span
                      className={`flex items-center gap-0.5 text-xs tabular ${
                        q.changePercent >= 0 ? "text-good" : "text-bad"
                      }`}
                    >
                      {q.changePercent >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(q.changePercent).toFixed(1)}%
                    </span>
                  )}
                </div>
              </li>
            ))}
            {quotes[0] && (
              <li className="pt-2 text-right text-[11px] text-ink-faint">
                Updated {formatRelativeTime(quotes[0].updatedAt)}
              </li>
            )}
          </ul>
        )}
      </StateView>
    </WidgetFrame>
  );
}
