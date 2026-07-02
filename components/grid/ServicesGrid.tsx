import { motion } from "framer-motion";
import Image from "next/image";
import { Scissors } from "lucide-react";
import { ComingSoon, ComingSoonGate } from "../ui/ComingSoon";
import { Project } from "@/services/projectService";

interface ServicesGridProps {
  services: Project[];
  onServiceClick: (project: Project) => void;
}

export const ServicesGrid = ({
  services,
  onServiceClick,
}: ServicesGridProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <ComingSoonGate enabled={false}>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {services.map((project) => {
          const thumb = project.files?.find((f) => f.file_type?.startsWith("image/"))?.file_url;
          return (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              onClick={() => onServiceClick(project)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0 relative bg-gray-100 flex items-center justify-center">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                ) : (
                  <Scissors size={36} className="text-gray-300" />
                )}
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description ?? ""}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Budget: </span>
                    <span className="font-semibold text-gray-900">
                      ₦ {project.budget ? Number(project.budget).toLocaleString() : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bids: </span>
                    <span className="font-semibold text-gray-900">
                      {project.bids?.length ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </ComingSoonGate>
  );
};
