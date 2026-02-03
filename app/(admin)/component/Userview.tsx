"use client";
import { motion } from "framer-motion";

interface UsersViewProps {
  onBack: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  imageUrl: string;
  status: "active" | "inactive";
  joinedDate: string;
}

export default function UsersView({ onBack }: UsersViewProps) {
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "HOSELITA IKOLI",
      role: "President and CEO",
      email: "hoselita@aff.com",
      imageUrl: "/api/placeholder/100/100",
      status: "active",
      joinedDate: "2020-01-15",
    },
    {
      id: "2",
      name: "SAMUEL IKOLI",
      role: "CTO and Managing Director",
      email: "samuel@aff.com",
      imageUrl: "/api/placeholder/100/100",
      status: "active",
      joinedDate: "2020-01-15",
    },
    {
      id: "3",
      name: "ANGEL IKOLI",
      role: "Managing Director",
      email: "angel@aff.com",
      imageUrl: "/api/placeholder/100/100",
      status: "active",
      joinedDate: "2021-03-10",
    },
    {
      id: "4",
      name: "MIETEI IKOLI",
      role: "Managing Director",
      email: "mietei@aff.com",
      imageUrl: "/api/placeholder/100/100",
      status: "active",
      joinedDate: "2021-03-10",
    },
  ];

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to remove ${name} from the team?`)
    ) {
      console.log("Deleting user:", id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 font-montserrat">
                Team Members
              </h1>
              <p className="text-gray-600">
                Manage your team profiles and roles
              </p>
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <span className="text-xl">+</span>
              Add Member
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-600">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      
      </div>
    </div>
  );
}
