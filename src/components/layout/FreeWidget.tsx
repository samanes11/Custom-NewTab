import { useRef, useState, type ReactNode } from "react";
import type { WidgetLayout } from "@/types";

interface Props {
    layout: WidgetLayout;
    minW: number;
    minH: number;
    zIndex: number;
    onChange: (layout: WidgetLayout) => void;
    onFocus: () => void;
    children: ReactNode;
}

const DRAG_THRESHOLD = 5;

export function FreeWidget({ layout, minW, minH, zIndex, onChange, onFocus, children }: Props) {
    const [draft, setDraft] = useState<WidgetLayout | null>(null);
    const [dragging, setDragging] = useState(false);
    const moved = useRef(false);
    const start = useRef({ px: 0, py: 0, x: 0, y: 0, w: 0, h: 0 });

    const view = draft ?? layout;

    function beginDrag(e: React.PointerEvent) {
        if (e.button !== 0) return;
        onFocus();
        moved.current = false;
        start.current = { px: e.clientX, py: e.clientY, x: layout.x, y: layout.y, w: layout.w, h: layout.h };

        function onMove(ev: PointerEvent) {
            const dx = ev.clientX - start.current.px;
            const dy = ev.clientY - start.current.py;
            if (!moved.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
            moved.current = true;
            setDragging(true);
            setDraft({ ...layout, x: Math.max(0, start.current.x + dx), y: Math.max(0, start.current.y + dy) });
        }
        function onUp() {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            setDragging(false);
            setDraft((d) => {
                if (d) onChange(d);
                return null;
            });
        }
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }

    function beginResize(e: React.PointerEvent) {
        e.stopPropagation();
        onFocus();
        start.current = { px: e.clientX, py: e.clientY, x: layout.x, y: layout.y, w: layout.w, h: layout.h };

        function onMove(ev: PointerEvent) {
            const dx = ev.clientX - start.current.px;
            const dy = ev.clientY - start.current.py;
            setDraft({ x: layout.x, y: layout.y, w: Math.max(minW, start.current.w + dx), h: Math.max(minH, start.current.h + dy) });
        }
        function onUp() {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            setDraft((d) => {
                if (d) onChange(d);
                return null;
            });
        }
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }

    return (
        <div
            onPointerDown={beginDrag}
            onClickCapture={(e) => {
                if (moved.current) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            style={{ position: "absolute", left: view.x, top: view.y, width: view.w, height: view.h, zIndex }}
            className={`transition-shadow duration-150 ${dragging ? "cursor-grabbing shadow-2xl" : "cursor-grab"}`}
        >
            <div className="h-full w-full">{children}</div>
            <div
                onPointerDown={beginResize}
                className="absolute -bottom-1 -right-1 h-4 w-4 cursor-se-resize rounded bg-ink-faint/30 hover:bg-accent"
            />
        </div>
    );
}