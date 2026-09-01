import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SEARCH_ENGINE_URLS } from "@/config";
import type { SearchEngine } from "@/types";

interface SearchBarProps {
  engine: SearchEngine;
}

export function SearchBar({ engine }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    window.location.href = `${SEARCH_ENGINE_URLS[engine]}${encodeURIComponent(trimmed)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" style={{ animationDelay: "40ms" }}>
      <div className="glass-panel group flex items-center gap-3 rounded-full px-5 py-3.5 transition-colors focus-within:border-accent/50">
        <Search className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-focus-within:text-accent" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search the web..."
          className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <kbd className="hidden shrink-0 rounded-md border border-surface-border px-1.5 py-0.5 text-[11px] text-ink-faint sm:block">
          /
        </kbd>
      </div>
    </form>
  );
}
