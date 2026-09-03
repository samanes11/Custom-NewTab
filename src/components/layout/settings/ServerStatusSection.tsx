import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ServerStatusItem, UserSettings } from "@/types";
import { SectionHeading, TextInput } from "@/components/common/FormControls";
import { generateId } from "@/utils/format";

interface Props {
    settings: UserSettings;
    update: (patch: Partial<UserSettings>) => void;
}

const EMPTY_DRAFT: Omit<ServerStatusItem, "id"> = {
    label: "",
    url: "",
    jsonPath: "",
    healthyValue: "",
    unhealthyValue: "",
};

export function ServerStatusSection({ settings, update }: Props) {
    const [draft, setDraft] = useState(EMPTY_DRAFT);

    function addItem() {
        if (!draft.label.trim() || !draft.url.trim()) return;
        const item: ServerStatusItem = { id: generateId(), ...draft };
        update({ serverStatusItems: [...settings.serverStatusItems, item] });
        setDraft(EMPTY_DRAFT);
    }

    function removeItem(id: string) {
        update({ serverStatusItems: settings.serverStatusItems.filter((i) => i.id !== id) });
    }

    function editItem(id: string, patch: Partial<ServerStatusItem>) {
        update({
            serverStatusItems: settings.serverStatusItems.map((i) =>
                i.id === id ? { ...i, ...patch } : i
            ),
        });
    }

    return (
        <div className="flex flex-col gap-5">
            <SectionHeading>Server Status</SectionHeading>

            <p className="text-xs leading-relaxed text-ink-faint">
                Enter the health-check URL that returns either JSON or plain text. If you need
                to check a specific field inside the JSON, provide a dot-path (for example{" "}
                <code className="rounded bg-surface-hover px-1 py-0.5">
                    mongodb.status
                </code>
                ). Then specify which value means healthy (for example{" "}
                <code className="rounded bg-surface-hover px-1 py-0.5">
                    connected
                </code>
                ) and which value means unhealthy (for example{" "}
                <code className="rounded bg-surface-hover px-1 py-0.5">
                    disconnected
                </code>
                ).
            </p>

            <ul className="flex flex-col gap-3">
                {settings.serverStatusItems.map((item) => (
                    <li key={item.id} className="flex flex-col gap-2 rounded-lg border border-surface-border p-3">
                        <div className="flex items-center gap-2">
                            <TextInput
                                value={item.label}
                                onChange={(e) => editItem(item.id, { label: e.target.value })}
                                placeholder="Label (e.g. MongoDB)"
                            />
                            <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.label}`}
                                className="shrink-0 rounded-lg p-2 text-ink-faint hover:bg-bad/10 hover:text-bad"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <TextInput
                            value={item.url}
                            onChange={(e) => editItem(item.id, { url: e.target.value })}
                            placeholder="https://api.example.com/health"
                        />

                        <TextInput
                            value={item.jsonPath ?? ""}
                            onChange={(e) => editItem(item.id, { jsonPath: e.target.value })}
                            placeholder="JSON path (optional), e.g. mongodb.status"
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <TextInput
                                value={item.healthyValue}
                                onChange={(e) => editItem(item.id, { healthyValue: e.target.value })}
                                placeholder="Healthy value"
                            />
                            <TextInput
                                value={item.unhealthyValue}
                                onChange={(e) => editItem(item.id, { unhealthyValue: e.target.value })}
                                placeholder="Unhealthy value"
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-surface-border pt-3">
                <TextInput
                    value={draft.label}
                    onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                    placeholder="Label"
                />
                <TextInput
                    value={draft.url}
                    onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                    placeholder="https://api.example.com/health"
                />
                <TextInput
                    value={draft.jsonPath}
                    onChange={(e) => setDraft({ ...draft, jsonPath: e.target.value })}
                    placeholder="JSON path (optional)"
                />
                <div className="grid grid-cols-2 gap-2">
                    <TextInput
                        value={draft.healthyValue}
                        onChange={(e) => setDraft({ ...draft, healthyValue: e.target.value })}
                        placeholder="Healthy value"
                    />
                    <TextInput
                        value={draft.unhealthyValue}
                        onChange={(e) => setDraft({ ...draft, unhealthyValue: e.target.value })}
                        placeholder="Unhealthy value"
                    />
                </div>
                <button
                    onClick={addItem}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90"
                >
                    <Plus className="h-3.5 w-3.5" /> افزودن سرویس
                </button>
            </div>
        </div>
    );
}
