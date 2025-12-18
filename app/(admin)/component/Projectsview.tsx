import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Project } from "../types/adminTypes";
import { BaseModal } from "../../../components/modals/BaseModal";
import ProjectDetailsModal from "./modals/Projectdetailsmodal";


interface ProjectsViewProps {
  onBack: () => void;
}

const ProjectsView = ({ onBack }: ProjectsViewProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  // Sample projects data
  const projects: Project[] = [
    {
      id: 1,
      title: "High Fashion Evening Gown Pattern",
      clientName: "Chioma Williams",
      tailorAssigned: "Gbolahan George",
      amount: "₦150,000",
      deadline: "Nov 10, 2023",
      status: "Completed",
      description:
        "I need a talented tailor to create a custom pattern for a high-fashion evening gown. The design should incorporate modern silhouettes with traditional craftsmanship.",
      requiredSkills: [
        "Fashion Design",
        "Pattern Drafting",
        "Alterations & Repairs",
        "Fabric Cutting & Laying",
      ],
      progress: 100,
      milestones: "4/4 milestones",
      clientRating: 4.9,
      tailorRating: 4.0,
    },
    {
      id: 2,
      title: "Corporate Suit Tailoring",
      clientName: "Adebayo Fashion",
      tailorAssigned: "Bimpe Couture",
      amount: "₦85,000",
      deadline: "Dec 15, 2023",
      status: "In Progress",
      progress: 60,
      milestones: "2/4 milestones",
      clientRating: 4.7,
      tailorRating: 4.5,
    },
    {
      id: 3,
      title: "Wedding Dress Design",
      clientName: "Fatima Styles",
      tailorAssigned: "John Designer",
      amount: "₦200,000",
      deadline: "Jan 20, 2024",
      status: "In Progress",
      progress: 35,
      milestones: "1/4 milestones",
    },
    {
      id: 4,
      title: "Traditional Outfit Collection",
      clientName: "Chioma Williams",
      tailorAssigned: "Gbolahan George",
      amount: "₦120,000",
      deadline: "Nov 5, 2023",
      status: "Completed",
      progress: 100,
      milestones: "4/4 milestones",
    },
  ];

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </motion.button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-(family-name:--font-montserrat)">
          Active Projects
        </h1>
        <p className="text-gray-600">
          Monitor active projects across the platform
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#5C4033] text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium ">
                Project Title
              </th>
              <th className="p-4 text-left text-sm font-medium">Client Name</th>
              <th className="p-4 text-left text-sm font-medium">
                Tailor Assigned
              </th>
              <th className="p-4 text-left text-sm font-medium">
                Amount charged
              </th>
              <th className="p-4 text-left text-sm font-medium">Deadline</th>
              <th className="p-4 text-left text-sm font-medium">Status</th>
              <th className="p-4 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 text-sm text-gray-900 font-medium">
                  {project.title}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {project.clientName}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {project.tailorAssigned}
                </td>
                <td className="p-4 text-sm text-gray-700">{project.amount}</td>
                <td className="p-4 text-sm text-gray-700">
                  {project.deadline}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleViewProject(project)}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    View project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing 1 to {projects.length} of 120 results
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-[#5C4033] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <BaseModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Project Details"
        maxWidth="2xl"
      >
        {selectedProject && <ProjectDetailsModal project={selectedProject} />}
      </BaseModal>
    </motion.div>
  );
};

export default ProjectsView;
