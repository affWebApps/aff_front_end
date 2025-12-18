import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { User } from "../types/adminTypes";
import { BaseModal } from "../../../components/modals/BaseModal";
import UserDetailsModal from "./modals/Userdetailsmodal";


interface UsersViewProps {
  onBack: () => void;
}

const UsersView = ({ onBack }: UsersViewProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Sample users data
  const users: User[] = [
    {
      id: 1,
      name: "Bimpe Couture",
      email: "bimpecouture@gmail.com",
      role: "Tailor",
      dateJoined: "Nov 10, 2023",
      status: "Active",
      image: "👤",
      contact: "+234 90 123 45 678",
      location: "Lagos, NG",
      bio: "With over 15 years of experience in custom tailoring and alterations, I specialize in creating perfectly fitted garments for every occasion.",
      availability: {
        weekdays: "10:00am - 6:00pm",
        weekend: "11:00am - 4:00pm",
      },
      activitySummary: {
        projectsPosted: 5,
        projectsCompleted: 3,
        productsListed: 10,
        productsSold: 0,
      },
      rating: 4.9,
    },
    {
      id: 2,
      name: "Chioma Williams",
      email: "chioma@gmail.com",
      role: "Designer",
      dateJoined: "Nov 10, 2023",
      status: "Active",
      image: "👤",
      contact: "+234 80 234 56 789",
      location: "Lagos, NG",
      activitySummary: {
        projectsPosted: 12,
        projectsCompleted: 8,
        productsListed: 25,
        productsSold: 15,
      },
      rating: 4.8,
    },
    {
      id: 3,
      name: "Adebayo Fashion",
      email: "adebayo@gmail.com",
      role: "Tailor",
      dateJoined: "Nov 10, 2023",
      status: "Inactive",
      image: "👤",
    },
    {
      id: 4,
      name: "Fatima Styles",
      email: "fatima@gmail.com",
      role: "Tailor",
      dateJoined: "Nov 10, 2023",
      status: "Active",
      image: "👤",
    },
    {
      id: 5,
      name: "John Designer",
      email: "john@gmail.com",
      role: "Dual-role",
      dateJoined: "Nov 10, 2023",
      status: "Inactive",
      image: "👤",
    },
  ];

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserModalOpen(true);
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
        <h1 className="text-3xl font-bold mb-2">Total Users</h1>
        <p className="text-gray-600">
          Manage all users on the AFF Platform here
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#5C4033] text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium">User</th>
              <th className="p-4 text-left text-sm font-medium">Email</th>
              <th className="p-4 text-left text-sm font-medium">Role</th>
              <th className="p-4 text-left text-sm font-medium">Date Joined</th>
              <th className="p-4 text-left text-sm font-medium">Status</th>
              <th className="p-4 text-left text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.image}
                    </div>
                    <span className="font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-700">{user.email}</td>
                <td className="p-4 text-sm text-gray-700">{user.role}</td>
                <td className="p-4 text-sm text-gray-700">{user.dateJoined}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    View profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing 1 to {users.length} of 120 results
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

      {/* User Details Modal */}
      <BaseModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="User Details"
        maxWidth="2xl"
      >
        {selectedUser && <UserDetailsModal user={selectedUser} />}
      </BaseModal>
    </motion.div>
  );
};

export default UsersView;
