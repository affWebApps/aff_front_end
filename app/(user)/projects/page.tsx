"use client";
import React, { useState } from "react";
import {
  Grid,
  List,
  MoreVertical,
  Plus,
  Folder,
  Lock,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useProjects } from "@/hooks/useProjects";
import { useDeleteProject, useCloseProject } from "@/hooks/useProjects";
import { Project, ProjectStatus } from "@/services/projectService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

const STATUS_COLOURS: Record<ProjectStatus, string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

function ProjectMenu({
  project,
  onDeleted,
}: {
  project: Project;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const { mutate: closeProject, isPending: closing } = useCloseProject(project.id);

  const isOwner = user?.id === project.designer_id;
  const canClose =
    isOwner &&
    (project.status === "OPEN" || project.status === "IN_PROGRESS");
  const canDelete = isOwner && project.status !== "IN_PROGRESS";

  if (!isOwner) return null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="text-gray-400 hover:text-gray-700 p-1 rounded"
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44">
            {canClose && (
              <>
                {project.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => {
                      closeProject("COMPLETED");
                      setOpen(false);
                    }}
                    disabled={closing}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-green-700"
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => {
                    closeProject("CLOSED");
                    setOpen(false);
                  }}
                  disabled={closing}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  Close Project
                </button>
              </>
            )}
            {canDelete && (
              <button
                onClick={() => {
                  deleteProject(project.id, { onSuccess: onDeleted });
                  setOpen(false);
                }}
                disabled={deleting}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onDeleted,
}: {
  project: Project;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const thumb = project.files?.[0]?.file_url;

  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden relative">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <Folder size={40} className="text-gray-300" />
        )}
        {project.is_blocked && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            <Lock size={10} /> Blocked
          </span>
        )}
      </div>
      <div className="p-4 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-medium text-gray-800 truncate">{project.title}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOURS[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            ₦{parseFloat(project.budget).toLocaleString()} · {timeAgo(project.updated_at)}
          </p>
        </div>
        <ProjectMenu project={project} onDeleted={onDeleted} />
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  onDeleted,
}: {
  project: Project;
  onDeleted: () => void;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center"
    >
      <div className="col-span-5 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
          {project.files?.[0]?.file_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.files[0].file_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Folder size={16} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-medium text-gray-800 block truncate">{project.title}</span>
          {project.is_blocked && (
            <span className="text-xs text-red-600 flex items-center gap-1">
              <Lock size={10} /> Blocked
            </span>
          )}
        </div>
      </div>
      <div className="col-span-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOURS[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>
      <div className="col-span-2 text-gray-600 text-sm">
        ₦{parseFloat(project.budget).toLocaleString()}
      </div>
      <div className="col-span-2 text-gray-500 text-sm">{timeAgo(project.updated_at)}</div>
      <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
        <ProjectMenu project={project} onDeleted={onDeleted} />
      </div>
    </div>
  );
}

const TAB_FILTERS: Record<string, (p: Project) => boolean> = {
  all: () => true,
  open: (p) => p.status === "OPEN",
  active: (p) => p.status === "IN_PROGRESS",
  closed: (p) => p.status === "COMPLETED" || p.status === "CLOSED",
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const { data: projects = [], isLoading, error, refetch } = useProjects();

  const filtered = projects.filter(TAB_FILTERS[activeTab] ?? (() => true));

  const tabs = [
    { key: "all", label: "All projects" },
    { key: "open", label: "Open" },
    { key: "active", label: "Active" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Projects
        </h1>
        <Button
          type="button"
          size="small"
          onClick={() => router.push("/projects/new")}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Project</span>
        </Button>
      </div>

      {/* Tabs and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4 sm:gap-6 border-b border-gray-300 overflow-x-auto w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 whitespace-nowrap text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-gray-800 text-gray-800 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-[#5C4033] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-[#5C4033] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load projects."}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Folder size={48} className="opacity-20 mb-3" />
          <p className="text-sm">No projects yet.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onDeleted={() => refetch()} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Budget</div>
            <div className="col-span-2">Updated</div>
            <div className="col-span-1" />
          </div>
          {filtered.map((p) => (
            <ProjectRow key={p.id} project={p} onDeleted={() => refetch()} />
          ))}
        </div>
      )}
    </div>
  );
}
