import { FileText, TrendingUp, Settings, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: "content", label: "Content Management", icon: FileText },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "config", label: "App Configuration", icon: Settings },
    { id: "newsletter", label: "Newsletter", icon: Mail },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="border-b border-gray-200 mb-8">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap font-(family-name:--font-montserrat) ${
              activeTab === tab.id
                ? "border-gray-900 text-gray-900 font-medium"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
