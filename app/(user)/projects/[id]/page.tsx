"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Lock,
  Users,
} from "lucide-react";
import { useProject } from "@/hooks/useProjects";
import { ProjectStatus, BidStatus } from "@/services/projectService";

const STATUS_COLOURS: Record<ProjectStatus, string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const BID_STATUS_COLOURS: Record<BidStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

function FileThumb({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <FileText size={18} className="text-gray-400" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(id ?? null);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Project not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-semibold text-gray-800">{project.title}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[project.status]}`}>
              {project.status.replace("_", " ")}
            </span>
            {project.is_blocked && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                <Lock size={10} /> Blocked
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">{project.description}</p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <DollarSign size={14} /> Budget
          </div>
          <p className="text-lg font-semibold text-gray-800">
            ₦{parseFloat(project.budget).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Clock size={14} /> Est. Time
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {project.estimated_time ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Calendar size={14} /> Created
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {formatDate(project.created_at)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Users size={14} /> Bids
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {project.bids?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Block reason */}
      {project.is_blocked && project.block_reason && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <strong>Blocked:</strong> {project.block_reason}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Files */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon size={16} className="text-gray-400" /> Files
          </h2>
          {project.files?.length > 0 ? (
            <ul className="space-y-2">
              {project.files.map((file) => {
                const filename = file.file_url.split("/").pop() ?? "File";
                return (
                  <li key={file.id}>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <FileThumb url={file.file_url} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate group-hover:text-amber-600 transition-colors">
                          {filename}
                        </p>
                        {file.file_type && (
                          <p className="text-xs text-gray-400">{file.file_type}</p>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No files attached.</p>
          )}
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-gray-400" /> Requirements
          </h2>
          {project.requirements?.length > 0 ? (
            <ul className="space-y-3">
              {project.requirements.map((req) => {
                const entries = Object.entries(req.content ?? {}).filter(([, v]) => v);
                return (
                  <li key={req.id} className="text-sm border border-gray-100 rounded-lg p-3">
                    {entries.length > 0 ? (
                      <dl className="space-y-1">
                        {entries.map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <dt className="text-gray-400 shrink-0 capitalize">{k}:</dt>
                            <dd className="text-gray-700">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <span className="text-gray-400">No content</span>
                    )}
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span className={req.designer_approved ? "text-green-600" : ""}>
                        Designer {req.designer_approved ? "✓" : "pending"}
                      </span>
                      <span className={req.tailor_approved ? "text-green-600" : ""}>
                        Tailor {req.tailor_approved ? "✓" : "pending"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No requirements yet.</p>
          )}
        </div>

        {/* Bids */}
        {project.bids?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5 lg:col-span-2">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={16} className="text-gray-400" /> Bids ({project.bids.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="py-2 px-3 text-left">Amount</th>
                    <th className="py-2 px-3 text-left">Duration</th>
                    <th className="py-2 px-3 text-left">Message</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {project.bids.map((bid) => (
                    <tr key={bid.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium text-gray-800">
                        ₦{parseFloat(bid.amount).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-gray-500">{bid.duration ?? "—"}</td>
                      <td className="py-2 px-3 text-gray-500 max-w-xs truncate">
                        {bid.message ?? "—"}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BID_STATUS_COLOURS[bid.status]}`}>
                          {bid.status.charAt(0) + bid.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-400 text-xs">
                        {formatDate(bid.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
