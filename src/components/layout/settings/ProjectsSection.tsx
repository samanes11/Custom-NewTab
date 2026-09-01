import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Project, UserSettings } from "@/types";
import { SectionHeading, TextInput } from "@/components/common/FormControls";
import { clamp, generateId } from "@/utils/format";

interface Props {
  settings: UserSettings;
  update: (patch: Partial<UserSettings>) => void;
}

export function ProjectsSection({ settings, update }: Props) {
  const [name, setName] = useState("");

  function addProject() {
    if (!name.trim()) return;
    const project: Project = { id: generateId(), name: name.trim(), progress: 0 };
    update({ projects: [...settings.projects, project] });
    setName("");
  }

  function removeProject(id: string) {
    update({ projects: settings.projects.filter((p) => p.id !== id) });
  }

  function editProject(id: string, patch: Partial<Project>) {
    update({ projects: settings.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading>Projects</SectionHeading>

      <ul className="flex flex-col gap-2">
        {settings.projects.map((project) => (
          <li key={project.id} className="flex items-center gap-2">
            <TextInput
              value={project.name}
              onChange={(e) => editProject(project.id, { name: e.target.value })}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={project.progress}
              onChange={(e) => editProject(project.id, { progress: clamp(Number(e.target.value), 0, 100) })}
              className="w-16 shrink-0 rounded-lg border border-surface-border bg-base/60 px-2 py-2 text-center text-sm text-ink focus:border-accent/50 focus:outline-none"
            />
            <span className="shrink-0 text-xs text-ink-faint">%</span>
            <button
              onClick={() => removeProject(project.id)}
              aria-label={`Remove ${project.name}`}
              className="shrink-0 rounded-lg p-2 text-ink-faint hover:bg-bad/10 hover:text-bad"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-t border-surface-border pt-3">
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="New project name" />
        <button
          onClick={addProject}
          aria-label="Add project"
          className="shrink-0 rounded-lg bg-accent p-2 text-white transition-colors hover:bg-accent/90"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
