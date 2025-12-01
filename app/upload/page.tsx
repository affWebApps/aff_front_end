"use client";

import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, CloudUpload, Loader2 } from "lucide-react";
import HomeLayout from "../(home)/layout";
import { Button } from "@/components/ui/Button";
import {
  uploadFileToSupabase,
  type UploadResult,
} from "@/lib/storageService";

type FileState = {
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
  result?: UploadResult;
};

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";

export default function UploadPage() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const hasMissingEnv = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    return !url || !/^https?:\/\/.+\..+/i.test(url) || !anon;
  }, []);

  const onFilesSelected = (selected: FileList | null) => {
    if (!selected || selected.length === 0) return;

    const nextFiles: FileState[] = Array.from(selected).map((file) => ({
      file,
      status: "idle",
    }));
    setFiles(nextFiles);
    setGlobalError(null);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onFilesSelected(event.dataTransfer.files);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(event.target.files);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setGlobalError("Choose at least one file to upload.");
      return;
    }

    setGlobalError(null);

    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: "uploading", message: undefined };
      setFiles([...updated]);

      try {
        const result = await uploadFileToSupabase({
          file: updated[i].file,
          bucket: bucketName,
          folder: "public",
        });

        updated[i] = {
          ...updated[i],
          status: "success",
          result,
          message: "Uploaded successfully.",
        };
      } catch (error) {
        console.error("Upload failed", {
          error,
          file: updated[i].file.name,
          bucket: bucketName,
        });
        const message =
          error instanceof Error ? error.message : "Upload failed.";
        updated[i] = {
          ...updated[i],
          status: "error",
          message,
        };
      }

      setFiles([...updated]);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <div>
            <p className="text-sm font-semibold text-amber-600 mb-2">
              Supabase Uploads
            </p>
            <h1 className="homeH1 text-[#5C4033] text-left md:text-center">
              Upload your files
            </h1>
            <p className="text-gray-600 mt-4 text-base md:text-lg text-left md:text-center">
              Files are sent directly to your Supabase storage bucket (
              <span className="font-semibold">{bucketName}</span>).
            </p>
            {hasMissingEnv && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>
                  Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  in your environment to enable uploads.
                </span>
              </div>
            )}
          </div>

          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center w-full border-2 border-dashed border-amber-300 rounded-xl p-10 cursor-pointer bg-amber-50/60 hover:bg-amber-50 transition"
          >
            <CloudUpload className="h-12 w-12 text-amber-500 mb-4" />
            <p className="text-lg font-semibold text-[#5C4033]">
              Drag & drop files here
            </p>
            <p className="text-gray-600 text-sm mb-3">
              or click to choose files from your device
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              className="sr-only"
              onChange={handleInputChange}
              aria-label="Upload files"
            />
            <div className="text-xs text-gray-500">
              We generate unique names and keep originals intact.
            </div>
          </label>

          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600">
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                : "No files selected yet."}
            </div>
            <Button
              variant="default"
              size="large"
              disabled={hasMissingEnv || files.length === 0}
              onClick={uploadFiles}
              className="flex items-center gap-2"
            >
              Upload
            </Button>
          </div>

          {globalError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{globalError}</span>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((fileState, index) => (
                <div
                  key={`${fileState.file.name}-${index}`}
                  className="border border-gray-100 rounded-xl p-4 flex items-start gap-3 shadow-sm"
                >
                  <div className="mt-1">
                    {fileState.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {fileState.status === "error" && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {fileState.status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                    )}
                    {fileState.status === "idle" && (
                      <CloudUpload className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {fileState.file.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {fileState.message && (
                      <div
                        className={`mt-2 text-sm ${fileState.status === "error"
                          ? "text-red-600"
                          : "text-green-600"
                          }`}
                      >
                        {fileState.message}
                      </div>
                    )}
                    {fileState.result?.publicUrl && (
                      <a
                        href={fileState.result.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-amber-600 hover:underline break-all"
                      >
                        View file
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
