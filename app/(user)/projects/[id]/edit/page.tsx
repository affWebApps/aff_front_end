"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Save } from "lucide-react";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { ProjectStatus } from "@/services/projectService";
import { ProjectFilesSection } from "@/components/projects/ProjectFilesSection";

const STATUS_OPTIONS: ProjectStatus[] = ["OPEN", "IN_PROGRESS", "COMPLETED", "CLOSED"];

const validationSchema = Yup.object({
  title: Yup.string().min(2, "Title must be at least 2 characters").required("Title is required"),
  description: Yup.string(),
  budget: Yup.number().min(0, "Budget must be a positive number").required("Budget is required"),
  estimatedTime: Yup.string(),
  status: Yup.string().oneOf(STATUS_OPTIONS),
});

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: project, isLoading, error } = useProject(id ?? null);
  const { mutate: updateProject, isPending } = useUpdateProject(id ?? "");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      budget: 0,
      estimatedTime: "",
      status: "OPEN" as ProjectStatus,
    },
    validationSchema,
    onSubmit: (values) => {
      updateProject(
        {
          title: values.title,
          description: values.description || undefined,
          budget: Number(values.budget),
          estimatedTime: values.estimatedTime || undefined,
          status: values.status,
        },
        {
          onSuccess: () => router.push(`/projects/${id}`),
        }
      );
    },
  });

  // Populate form once project loads
  useEffect(() => {
    if (!project) return;
    formik.setValues({
      title: project.title,
      description: project.description ?? "",
      budget: parseFloat(project.budget),
      estimatedTime: project.estimated_time ?? "",
      status: project.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // Redirect non-owners away
  useEffect(() => {
    if (project && user && project.designer_id !== user.id) {
      router.replace(`/projects/${id}`);
    }
  }, [project, user, id, router]);

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-200 rounded-lg mt-6" />
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
        <ArrowLeft size={16} /> Back to Project
      </button>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Project</h1>

        <ProjectFilesSection projectId={id} files={project.files ?? []} />

        <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5 mt-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
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

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" size="large" disabled={isPending || !formik.dirty}>
              <Save size={16} />
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="text"
              size="large"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
