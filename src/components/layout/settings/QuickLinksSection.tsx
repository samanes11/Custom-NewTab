import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { QuickLink, UserSettings } from "@/types";
import { SectionHeading, TextInput } from "@/components/common/FormControls";
import { generateId } from "@/utils/format";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function QuickLinksSection({ settings, update }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  function addLink() {
    if (!title.trim() || !url.trim()) return;
    const normalizedUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
    const link: QuickLink = { id: generateId(), title: title.trim(), url: normalizedUrl };
    update({ quickLinks: [...settings.quickLinks, link] });
    setTitle("");
    setUrl("");
  }

  function removeLink(id: string) {
    update({ quickLinks: settings.quickLinks.filter((l) => l.id !== id) });
  }

  function editLink(id: string, patch: Partial<QuickLink>) {
    update({ quickLinks: settings.quickLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Quick Links</SectionHeading>

      <ul className="flex flex-col gap-2">
        {settings.quickLinks.map((link) => (
          <li key={link.id} className="flex items-center gap-2">
            <TextInput
              value={link.title}
              onChange={(e) => editLink(link.id, { title: e.target.value })}
              className="w-28 shrink-0"
            />
            <TextInput value={link.url} onChange={(e) => editLink(link.id, { url: e.target.value })} />
            <button
              onClick={() => removeLink(link.id)}
              aria-label={`Remove ${link.title}`}
              className="shrink-0 rounded-lg p-2 text-ink-faint hover:bg-bad/10 hover:text-bad"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-t border-surface-border pt-3">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-28 shrink-0" />
        <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        <button
          onClick={addLink}
          aria-label="Add link"
          className="shrink-0 rounded-lg bg-accent p-2 text-white transition-colors hover:bg-accent/90"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
