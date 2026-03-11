// ProjectDetailsModal.tsx
import { Star } from "lucide-react";
import { Project } from "../../types/adminTypes";

interface ProjectDetailsModalProps {
  project: Project;
}

const ProjectDetailsModal = ({ project }: ProjectDetailsModalProps) => {
  return (
    <div className="space-y-8  overflow-y-auto px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {project.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === "Completed"
                ? "bg-green-100 text-green-700"
                : project.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm text-gray-500 mb-2">Client</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {project.clientName}
              </p>
              {project.clientRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-gray-600">
                    {project.clientRating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm text-gray-500 mb-2">Tailor Assigned</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {project.tailorAssigned}
              </p>
              {project.tailorRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-gray-600">
                    {project.tailorRating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">
          Project Description
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {project.description ||
            "I need a talented tailor to create a custom pattern for a high-fashion evening gown. The design should incorporate modern silhouettes with traditional craftsmanship."}
        </p>
      </div>

      {project.requiredSkills && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Progress</h4>
            <p className="text-2xl font-bold text-gray-900">
              {project.progress || "75"}%
            </p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Deadline</h4>
            <p className="text-lg font-semibold text-gray-900">
              {project.deadline}
            </p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Amount charged</h4>
            <p className="text-lg font-semibold text-gray-900">
              {project.amount}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overall Progress</h4>
        <p className="text-sm text-gray-600 mb-3">
          {project.milestones || "3/4 milestones"}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-amber-900 h-3 rounded-full transition-all duration-300"
            style={{ width: `${project.progress || 75}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
