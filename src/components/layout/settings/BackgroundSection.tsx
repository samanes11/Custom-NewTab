import { useRef, useState } from "react";
import { RotateCcw, Upload } from "lucide-react";
import type { UserSettings } from "@/types";
import { SectionHeading } from "@/components/common/FormControls";
import { DEFAULT_BACKGROUND_IMAGE } from "@/config";
import { readAndCompressImage } from "@/utils/image";

interface Props {
    settings: UserSettings;
    update: (patch: Partial<UserSettings>) => void;
}

export function BackgroundSection({ settings, update }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setError(null);
            const dataUrl = await readAndCompressImage(file);
            update({ backgroundImage: dataUrl });
        } catch (err) {
            setError(err instanceof Error ? err.message : "خطا در بارگذاری تصویر");
        } finally {
            e.target.value = "";
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <SectionHeading>پس‌زمینه</SectionHeading>

            <div
                className="h-32 w-full rounded-lg border border-surface-border bg-cover bg-center"
                style={{ backgroundImage: `url(${settings.backgroundImage})` }}
            />

            {error && <p className="text-xs text-bad">{error}</p>}

            <div className="flex gap-2">
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90"
                >
                    <Upload className="h-3.5 w-3.5" /> انتخاب تصویر
                </button>
                <button
                    onClick={() => update({ backgroundImage: DEFAULT_BACKGROUND_IMAGE })}
                    className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-2 text-sm text-ink-dim hover:text-ink"
                >
                    <RotateCcw className="h-3.5 w-3.5" /> بازگشت به پیش‌فرض
                </button>
            </div>

            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
    );
}