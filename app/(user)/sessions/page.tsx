"use client";

import React, { useState } from "react";
import { MessageSquare, Search, Filter } from "lucide-react";
import Image from "next/image";

interface Session {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "client" | "tailor";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: "active" | "completed" | "pending";
  orderId?: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    participantName: "Amara Diallo",
    participantAvatar: "/images/african-woman.png",
    participantRole: "tailor",
    lastMessage: "Your ankara gown is ready for final fitting!",
    timestamp: "2m ago",
    unreadCount: 2,
    status: "active",
    orderId: "ORD-2024-001",
  },
  {
    id: "2",
    participantName: "Kwame Asante",
    participantAvatar: "/images/tailor.jpg",
    participantRole: "tailor",
    lastMessage: "I've updated the measurements. Please confirm.",
    timestamp: "1h ago",
    unreadCount: 0,
    status: "active",
    orderId: "ORD-2024-002",
  },
  {
    id: "3",
    participantName: "Fatima Nkrumah",
    participantAvatar: "/images/tailor2.jpg",
    participantRole: "tailor",
    lastMessage: "Thank you for your order! I'll begin working on it soon.",
    timestamp: "3h ago",
    unreadCount: 1,
    status: "pending",
    orderId: "ORD-2024-003",
  },
  {
    id: "4",
    participantName: "Seun Okafor",
    participantAvatar: "/images/client.jpg",
    participantRole: "client",
    lastMessage: "Can we discuss the fabric options?",
    timestamp: "Yesterday",
    unreadCount: 0,
    status: "active",
    orderId: "ORD-2024-004",
  },
  {
    id: "5",
    participantName: "Zara Mensah",
    participantAvatar: "/images/both.jpg",
    participantRole: "tailor",
    lastMessage: "Your order has been completed. Enjoy!",
    timestamp: "2 days ago",
    unreadCount: 0,
    status: "completed",
    orderId: "ORD-2024-005",
  },
];

const statusStyles: Record<Session["status"], string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
};

export default function SessionsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | Session["status"]
  >("all");

  const filtered = mockSessions.filter((s) => {
    const matchesSearch =
      s.participantName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastMessage.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || s.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-montserrat text-[#3d2b1f]">
          Sessions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your active and past conversations with tailors and clients.
        </p>
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search sessions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FAB75B]/50 focus:border-[#FAB75B]"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter size={15} className="text-gray-400" />
          {(["all", "active", "pending", "completed"] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors duration-150
                  ${
                    activeFilter === filter
                      ? "bg-[#FAB75B] text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-[#FAB75B] hover:text-[#FAB75B]"
                  }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </div>

      {/* Session list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <MessageSquare size={48} className="mb-4 opacity-40" />
          <p className="text-sm">No sessions found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((session) => (
            <li key={session.id}>
              <button className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FAB75B]/40 transition-all duration-200 p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={session.participantAvatar}
                        alt={session.participantName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {session.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#FAB75B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#3d2b1f] truncate">
                        {session.participantName}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {session.timestamp}
                      </span>
                    </div>

                    <p
                      className={`text-xs mt-0.5 truncate ${
                        session.unreadCount > 0
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {session.lastMessage}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[session.status]}`}
                      >
                        {session.status}
                      </span>
                      {session.orderId && (
                        <span className="text-[10px] text-gray-400">
                          {session.orderId}
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full capitalize ml-auto
                          ${session.participantRole === "tailor" ? "bg-[#6b4e3d]/10 text-[#6b4e3d]" : "bg-blue-50 text-blue-600"}`}
                      >
                        {session.participantRole}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
