"use client";
import { useRef, useState } from "react";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { useUpdateProject, useDeleteProjectFile } from "@/hooks/useProjects";
import { ProjectFile } from "@/services/projectService";
import { uploadFileToSupabase } from "@/lib/storageService";

interface Props {
  projectId: string;
  files: ProjectFile[];
}

function FileThumb({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <FileText size={16} className="text-gray-400" />;
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

export function ProjectFilesSection({ projectId, files }: Props) {
  const { mutate: updateProject } = useUpdateProject(projectId);
  const { mutate: deleteFile } = useDeleteProjectFile();
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const { publicUrl } = await uploadFileToSupabase({
          file,
          folder: `public/projects/${projectId}`,
        });
        if (!publicUrl) throw new Error("Upload failed — no public URL returned.");
        await new Promise<void>((resolve, reject) =>
          updateProject(
            { files: [{ fileUrl: publicUrl, fileType: file.type || undefined }] },
            { onSuccess: () => resolve(), onError: (e) => reject(e) }
          )
        );
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">Project Files</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload size={13} />
          {uploading ? "Uploading…" : "Upload file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <div className="flex items-center justify-between rounded bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
          {uploadError}
          <button type="button" onClick={() => setUploadError(null)}><X size={12} /></button>
        </div>
      )}

      {files.length === 0 ? (
        <p className="text-sm text-gray-400">No files attached yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => {
            const filename = file.file_url.split("/").pop() ?? "File";
            return (
              <li key={file.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  <FileThumb url={file.file_url} />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-700 truncate block hover:text-amber-600 transition-colors"
                  >
                    {filename}
                  </a>
                  {file.file_type && (
                    <p className="text-xs text-gray-400">{file.file_type}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmDeleteId === file.id) {
                      deleteFile({ projectId, fileId: file.id });
                      setConfirmDeleteId(null);
                    } else {
                      setConfirmDeleteId(file.id);
                    }
                  }}
                  onBlur={() => setConfirmDeleteId(null)}
                  className={`shrink-0 text-xs px-2 py-1 rounded transition-colors ${
                    confirmDeleteId === file.id
                      ? "bg-red-100 text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  {confirmDeleteId === file.id ? "Remove?" : <Trash2 size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
