import { motion } from "framer-motion";
import Image from "next/image";

interface Service {
  id: string | number;
  image: string;
  title: string;
  description: string;
  budget: string | number;
  bids: string | number;
}

interface ServicesGridProps {
  services: Service[];
}

export const ServicesGrid = ({ services }: ServicesGridProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {services.map((service) => (
        <motion.div
          key={service.id}
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col sm:flex-row"
        >
          <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0 relative">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
            />
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Budget: </span>
                <span className="font-semibold text-gray-900">
                  ₦ {service.budget}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Bids: </span>
                <span className="font-semibold text-gray-900">
                  {service.bids}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
