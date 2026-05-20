"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "../types/adminTypes";
import { useUsers } from "@/hooks/useUsers";

interface UsersViewProps {
  onBack: () => void;
}

const UsersView = ({ onBack }: UsersViewProps) => {
  const { data: apiUsers, isLoading, isError } = useUsers();

  const users: User[] = (apiUsers ?? []).map((u) => ({
    id: u.id,
    name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.display_name || "—",
    email: u.email,
    role: u.role,
    dateJoined: new Date(u.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: u.is_verified ? "Active" : "Inactive",
    isBlocked: !u.is_active,
    image: u.avatar_url ?? "👤",
    contact: u.phone_number ?? undefined,
    location: [u.city, u.country].filter(Boolean).join(", ") || undefined,
    bio: u.bio ?? undefined,
  }));

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
        <p className="text-gray-600">Manage all users on the AFF Platform here</p>
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
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-gray-400">
                  Loading users…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-red-500">
                  Failed to load users. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {user.image.startsWith("http") ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.image}</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-700">{user.email}</td>
                <td className="p-4 text-sm text-gray-700">{user.role.toUpperCase()}</td>
                <td className="p-4 text-sm text-gray-700">{user.dateJoined}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/users/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    View profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && !isError && users.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default UsersView;
