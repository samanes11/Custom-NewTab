import { useState } from "react";
import { Link2, Plus, X } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import { useDragReorder } from "@/hooks/useDragReorder";
import { generateId } from "@/utils/format";
import type { QuickLink } from "@/types";

interface Props {
  links: QuickLink[];
  onChange: (links: QuickLink[]) => void;
}

function faviconFor(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

function hostFor(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function QuickLinksWidget({ links, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [failedFavicons, setFailedFavicons] = useState<Record<string, boolean>>({});

  const { getItemProps } = useDragReorder(links, onChange);

  function submitAdd() {
    if (!title.trim() || !url.trim()) return;

    const normalizedUrl = /^https?:\/\//.test(url)
      ? url
      : `https://${url}`;

    onChange([
      ...links,
      {
        id: generateId(),
        title: title.trim(),
        url: normalizedUrl,
      },
    ]);

    setTitle("");
    setUrl("");
    setAdding(false);
  }

  function removeLink(id: string) {
    onChange(links.filter((l) => l.id !== id));
  }

  return (
    <WidgetFrame icon={Link2} title="Quick Links">
      {links.length === 0 && !adding ? (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full flex-col items-center gap-2 py-4 text-center text-xs text-ink-faint hover:text-ink"
        >
          <Plus className="h-4 w-4" />
          Add your first link
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {links.map((link, index) => {
            const favicon = !failedFavicons[link.id]
              ? faviconFor(link.url)
              : null;

            const { isDragging, isOver, ...dragProps } = getItemProps(index);

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                title={hostFor(link.url)}
                {...dragProps}
                className={`group relative flex flex-col items-center gap-1.5 rounded-lg px-1 py-2.5 text-center transition-all duration-150 ease-spring-bounce hover:bg-surface-hover ${isOver ? "scale-105 bg-accent-soft" : ""
                  } ${isDragging ? "scale-95 opacity-40" : ""}`}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeLink(link.id);
                  }}
                  aria-label={`Remove ${link.title}`}
                  className="absolute right-0.5 top-0.5 hidden rounded-full bg-base p-0.5 text-ink-faint hover:text-bad group-hover:block"
                >
                  <X className="h-3 w-3" />
                </button>

                {favicon ? (
                  <img
                    src={favicon}
                    alt=""
                    className="h-5 w-5 rounded-sm"
                    loading="lazy"
                    onError={() =>
                      setFailedFavicons((prev) => ({
                        ...prev,
                        [link.id]: true,
                      }))
                    }
                  />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-accent-soft text-[10px] font-semibold text-accent">
                    {link.title.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                )}

                <span className="w-full truncate text-[11px] text-ink-dim">
                  {link.title}
                </span>
              </a>
            );
          })}

          {adding ? (
            <div className="col-span-3 flex items-center gap-1.5 rounded-lg border border-surface-border p-1.5">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitAdd();
                }}
                placeholder="Title"
                className="w-1/3 rounded-md bg-base/60 px-2 py-1 text-xs text-ink placeholder:text-ink-faint focus:outline-none"
              />

              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitAdd();
                }}
                placeholder="https://..."
                className="flex-1 rounded-md bg-base/60 px-2 py-1 text-xs text-ink placeholder:text-ink-faint focus:outline-none"
              />

              <button
                onClick={submitAdd}
                className="rounded-md bg-accent p-1.5 text-white hover:bg-accent/90"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              aria-label="Add link"
              className="flex flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2.5 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <Plus className="h-5 w-5" />
              <span className="text-[11px]">Add</span>
            </button>
          )}
        </div>
      )}
    </WidgetFrame>
  );
}
