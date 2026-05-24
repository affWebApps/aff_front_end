"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUsers, UserFilters } from "@/hooks/useUsers";

type SortField = "first_name" | "last_name" | "email" | "created_at";
type SortOrder = "asc" | "desc";

interface UsersViewProps {
  onBack: () => void;
}

const UsersView = ({ onBack }: UsersViewProps) => {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") ?? undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState<UserFilters>(
    initialRole ? { role: initialRole } : {}
  );

  const { data, isLoading, isError, isFetching } = useUsers(currentPage, sortBy, sortOrder, filters);

  const updateFilter = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "") {
        delete next[key];
      } else if (key === "isVerified" || key === "isActive") {
        next[key] = value === "true";
      } else {
        next[key] = value;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ChevronsUpDown size={13} className="text-white/50" />;
    return sortOrder === "asc"
      ? <ChevronUp size={13} className="text-white" />
      : <ChevronDown size={13} className="text-white" />;
  };

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;

  const goTo = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (currentPage >= totalPages - 3)
      return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages];
  };

  const firstItem = (currentPage - 1) * limit + 1;
  const lastItem = Math.min(currentPage * limit, total);

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
        <h1 className="text-3xl font-bold mb-2">
          Total Users {total > 0 && <span className="text-gray-400 font-normal text-2xl">({total})</span>}
        </h1>
        <p className="text-gray-600">Manage all users on the AFF Platform here</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filters.role ?? ""}
          onChange={(e) => updateFilter("role", e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#5C4033]/30"
        >
          <option value="">All Roles</option>
          <option value="designer">Designer</option>
          <option value="tailor">Tailor</option>
          <option value="both">Both</option>
        </select>

        <select
          value={filters.isVerified === undefined ? "" : String(filters.isVerified)}
          onChange={(e) => updateFilter("isVerified", e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#5C4033]/30"
        >
          <option value="">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        <select
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) => updateFilter("isActive", e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#5C4033]/30"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Blocked</option>
        </select>

        <select
          value={filters.authProvider ?? ""}
          onChange={(e) => updateFilter("authProvider", e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#5C4033]/30"
        >
          <option value="">All Providers</option>
          <option value="EMAIL">Email</option>
          <option value="GOOGLE">Google</option>
          <option value="FACEBOOK">Facebook</option>
        </select>

        {Object.keys(filters).length > 0 && (
          <button
            onClick={() => { setFilters({}); setCurrentPage(1); }}
            className="text-sm text-gray-400 hover:text-gray-700 px-3 py-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className={`bg-white rounded-lg shadow-sm overflow-hidden transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#5C4033] text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("first_name")}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  User <SortIcon field="first_name" />
                </button>
              </th>
              <th className="p-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Email <SortIcon field="email" />
                </button>
              </th>
              <th className="p-4 text-left text-sm font-medium">Role</th>
              <th className="p-4 text-left text-sm font-medium">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  Date Joined <SortIcon field="created_at" />
                </button>
              </th>
              <th className="p-4 text-left text-sm font-medium">Status</th>
              <th className="p-4 text-left text-sm font-medium">Auth Provider</th>
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
            {users.map((user, index) => {
              const name =
                [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
              const isBlocked = !user.is_active;
              const dateJoined = new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr
                  key={user.id}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {name}
                        </Link>
                        {isBlocked && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{user.email}</td>
                  <td className="p-4 text-sm text-gray-700">{user.role.toUpperCase()}</td>
                  <td className="p-4 text-sm text-gray-700">{dateJoined}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.is_verified
                          ? "bg-blue-50 text-blue-600"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {user.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {user.auth_provider.charAt(0) + user.auth_provider.slice(1).toLowerCase()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        {!isLoading && !isError && total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {firstItem}–{lastItem} of {total} users
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goTo(p as number)}
                    disabled={isFetching}
                    className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors ${
                      p === currentPage
                        ? "bg-[#5C4033] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UsersView;
