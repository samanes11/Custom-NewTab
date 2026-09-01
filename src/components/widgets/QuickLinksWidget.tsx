import { Link2 } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import type { QuickLink } from "@/types";

interface Props {
  links: QuickLink[];
}

function faviconFor(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

export function QuickLinksWidget({ links }: Props) {
  return (
    <WidgetFrame icon={Link2} title="Quick Links">
      {links.length === 0 ? (
        <p className="py-4 text-center text-xs text-ink-faint">Add links in Settings → Quick Links</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {links.map((link) => {
            const favicon = faviconFor(link.url);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-lg px-1 py-2.5 text-center transition-colors hover:bg-surface-hover"
              >
                {favicon ? (
                  <img src={favicon} alt="" className="h-5 w-5 rounded-sm" loading="lazy" />
                ) : (
                  <Link2 className="h-5 w-5 text-ink-faint" />
                )}
                <span className="w-full truncate text-[11px] text-ink-dim">{link.title}</span>
              </a>
            );
          })}
        </div>
      )}
    </WidgetFrame>
  );
}
