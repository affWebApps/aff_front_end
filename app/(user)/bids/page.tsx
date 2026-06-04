"use client";
import React, { useState } from "react";
import { Gavel, Trash2 } from "lucide-react";
import { useMyBids } from "@/hooks/useProjects";
import { useDeleteBid } from "@/hooks/useProjects";
import { Bid, BidStatus } from "@/services/projectService";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_COLOURS: Record<BidStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

function BidRow({ bid, onDeleted }: { bid: Bid; onDeleted: () => void }) {
  const router = useRouter();
  const { mutate: deleteBid, isPending } = useDeleteBid();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); return; }
    deleteBid(bid.id, { onSuccess: onDeleted });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <button
          onClick={() => bid.project_id && router.push(`/projects/${bid.project_id}`)}
          className="text-left font-medium text-gray-800 hover:text-amber-600 hover:underline transition-colors"
        >
          {bid.project?.title ?? bid.project_id}
        </button>
        {bid.project && (
          <p className="text-xs text-gray-400 mt-0.5">
            Budget: ₦{parseFloat(bid.project.budget).toLocaleString()}
          </p>
        )}
      </td>
      <td className="py-3 px-4 text-gray-700">
        ₦{parseFloat(bid.amount).toLocaleString()}
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">
        {bid.duration ?? "—"}
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOURS[bid.status]}`}>
          {bid.status.charAt(0) + bid.status.slice(1).toLowerCase()}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-400 text-sm">{timeAgo(bid.created_at)}</td>
      <td className="py-3 px-4">
        {bid.status === "PENDING" && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors disabled:opacity-40 ${
              confirming
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "text-gray-400 hover:text-red-500"
            }`}
            onBlur={() => setConfirming(false)}
          >
            <Trash2 size={13} />
            {confirming ? "Confirm?" : "Withdraw"}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function MyBidsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: bids = [], isLoading, error, refetch } = useMyBids();

  const filtered =
    activeTab === "all" ? bids : bids.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Gavel size={24} className="text-[#5C4033]" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 font-(family-name:--font-montserrat)">
          My Bids
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 sm:gap-6 border-b border-gray-300 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? bids.length
              : bids.filter((b) => b.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 whitespace-nowrap text-sm transition-colors flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "border-b-2 border-gray-800 text-gray-800 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to load bids."}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Gavel size={40} className="opacity-20 mb-3" />
            <p className="text-sm">No bids found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="py-3 px-4 text-left">Project</th>
                  <th className="py-3 px-4 text-left">Your Bid</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Submitted</th>
                  <th className="py-3 px-4 text-left" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((bid) => (
                  <BidRow key={bid.id} bid={bid} onDeleted={refetch} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
