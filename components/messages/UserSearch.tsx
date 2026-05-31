"use client";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserSearch } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/authStore";

interface UserSearchProps {
  onSelectUser: (userId: string) => void;
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
  const { user: currentUser } = useAuthStore();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isFetching } = useUserSearch(query, page);

  const results = (data?.data ?? []).filter((u) => u.id !== currentUser?.id);
  const totalPages = data?.totalPages ?? 1;

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by name…"
            autoFocus
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
            <Search size={36} className="opacity-20 mb-2" />
            <p className="text-sm">Type a name to find someone</p>
          </div>
        ) : isFetching ? (
          <div className="flex justify-center pt-10">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
            <p className="text-sm">No users found for &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((u) => {
              const name =
                u.display_name ||
                `${u.first_name} ${u.last_name}`.trim() ||
                "Unknown";
              const initials = name.charAt(0).toUpperCase();

              return (
                <li key={u.id}>
                  <button
                    onClick={() => onSelectUser(u.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden">
                      {u.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.avatar_url}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{initials}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                      {u.role && (
                        <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
}
