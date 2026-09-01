import { FolderKanban } from "lucide-react";
import { WidgetFrame } from "@/components/common/WidgetFrame";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
}

export function ProjectsWidget({ projects }: Props) {
  return (
    <WidgetFrame icon={FolderKanban} title="Projects">
      {projects.length === 0 ? (
        <p className="py-4 text-center text-xs text-ink-faint">Add projects in Settings → Projects</p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {projects.map((project) => (
            <li key={project.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="truncate text-ink">{project.name}</span>
                <span className="tabular text-ink-faint">{project.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </WidgetFrame>
  );
}
