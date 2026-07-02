"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, FileText, Trash2, Upload, X } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/Button";
import { uploadFileToSupabase } from "@/lib/storageService";

interface StagedFile {
  file: File;
  preview: string | null;
}

const validationSchema = Yup.object({
  title: Yup.string().min(2, "Title must be at least 2 characters").required("Title is required"),
  description: Yup.string(),
  budget: Yup.number()
    .min(0, "Budget must be a positive number")
    .required("Budget is required"),
  estimatedTime: Yup.string(),
});

export default function NewProjectPage() {
  const router = useRouter();
  const { mutate: createProject, isPending } = useCreateProject();

  const inputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      budget: "" as unknown as number,
      estimatedTime: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setUploadError(null);
      let uploadedFiles: { fileUrl: string; fileType?: string }[] = [];

      if (staged.length > 0) {
        setIsUploading(true);
        try {
          uploadedFiles = await Promise.all(
            staged.map(async ({ file }) => {
              const { publicUrl } = await uploadFileToSupabase({
                file,
                folder: "public/projects",
              });
              if (!publicUrl) throw new Error(`Upload failed for ${file.name}`);
              return { fileUrl: publicUrl, fileType: file.type || undefined };
            })
          );
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "File upload failed.");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      createProject(
        {
          title: values.title,
          description: values.description || undefined,
          budget: Number(values.budget),
          estimatedTime: values.estimatedTime || undefined,
          ...(uploadedFiles.length > 0 && { files: uploadedFiles }),
        },
        {
          onSuccess: (project) => router.push(`/projects/${project.id}`),
        }
      );
    },
  });

  const stageFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setStaged((prev) => [...prev, ...incoming]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeStaged = (index: number) => {
    setStaged((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

  const isBusy = isPending || isUploading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">New Project</h1>

        {/* File staging */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Attach Files</h2>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
            >
              <Upload size={13} /> Add files
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => stageFiles(e.target.files)}
            />
          </div>

          {uploadError && (
            <div className="flex items-center justify-between rounded bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {uploadError}
              <button type="button" onClick={() => setUploadError(null)}>
                <X size={12} />
              </button>
            </div>
          )}

          {staged.length === 0 ? (
            <p className="text-sm text-gray-400">No files selected. Files will be uploaded when you create the project.</p>
          ) : (
            <ul className="space-y-2">
              {staged.map(({ file, preview }, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaged(i)}
                    className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Custom wedding gown"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${
                hasError("title") ? "border-red-400 ring-2 ring-red-100" : "border-gray-300"
              }`}
            />
            {hasError("title") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the project, requirements, style preferences…"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₦) <span className="text-red-500">*</span>
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              min={0}
              placeholder="0"
              value={formik.values.budget}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${
                hasError("budget") ? "border-red-400 ring-2 ring-red-100" : "border-gray-300"
              }`}
            />
            {hasError("budget") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.budget}</p>
            )}
          </div>

          {/* Estimated Time */}
          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time
            </label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              placeholder="e.g. 2 weeks"
              value={formik.values.estimatedTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" size="large" disabled={isBusy}>
              {isUploading ? "Uploading files…" : isPending ? "Creating…" : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="text"
              size="large"
              onClick={() => router.back()}
              disabled={isBusy}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
