import type { ServerStatusItem, ServerStatusState } from "@/types";

function getAtPath(obj: unknown, path: string): unknown {
    if (!path) return obj;
    return path.split(".").reduce<unknown>((acc, key) => {
        if (acc == null || typeof acc !== "object") return undefined;
        return (acc as Record<string, unknown>)[key];
    }, obj);
}

function toComparableString(value: unknown): string {
    if (value == null) return "";
    if (typeof value === "string") return value.trim().toLowerCase();
    if (typeof value === "boolean" || typeof value === "number") return String(value).toLowerCase();
    try {
        return JSON.stringify(value).toLowerCase();
    } catch {
        return "";
    }
}

async function readBody(res: Response): Promise<unknown> {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export async function checkServerStatus(item: ServerStatusItem): Promise<ServerStatusState> {
    try {
        const res = await fetch(item.url, { method: "GET" });
        if (!res.ok) return "offline";

        const body = await readBody(res);
        const value = toComparableString(getAtPath(body, item.jsonPath ?? ""));
        const healthy = (item.healthyValue ?? "").trim().toLowerCase();
        const unhealthy = (item.unhealthyValue ?? "").trim().toLowerCase();

        if (healthy && value.includes(healthy)) return "online";
        if (unhealthy && value.includes(unhealthy)) return "offline";
        return "degraded";
    } catch {
        return "offline";
    }
}

export async function checkAllServerStatuses(
    items: ServerStatusItem[],
): Promise<Record<string, ServerStatusState>> {
    const entries = await Promise.all(
        items.map(async (item): Promise<readonly [string, ServerStatusState]> => {
            if (!item.url || !item.url.trim()) return [item.id, "degraded"];
            const state = await checkServerStatus(item);
            return [item.id, state];
        }),
    );
    return Object.fromEntries(entries);
}