"use client";
import { MessageCircle } from "lucide-react";
import { Chat } from "@/services/messageService";
import { useAuthStore } from "@/store/authStore";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  const { user } = useAuthStore();

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16 text-gray-400">
        <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {chats.map((chat) => {
        const other = chat.user1_id === user?.id ? chat.user2 : chat.user1;
        const name = `${other?.first_name ?? ""} ${other?.last_name ?? ""}`.trim() || "Unknown";
        const initials = name.charAt(0).toUpperCase();
        const isSelected = chat.id === selectedChatId;
        const lastMsg = chat.messages?.[chat.messages.length - 1];
        const preview = lastMsg?.content ?? "";
        const time = lastMsg ? timeAgo(lastMsg.created_at) : "";
        const hasUnread = !!(lastMsg && !lastMsg.read && lastMsg.receiver_id === user?.id);

        return (
          <li key={chat.id}>
            <button
              onClick={() => onSelectChat(chat)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                isSelected ? "bg-amber-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden">
                {other?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={other.avatar_url}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{initials}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm truncate ${hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                    {name}
                  </span>
                  {time && (
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{time}</span>
                  )}
                </div>
                <p className={`text-xs truncate ${hasUnread ? "font-medium text-gray-700" : "text-gray-400"}`}>
                  {preview || "No messages yet"}
                </p>
              </div>

              {hasUnread && (
                <span className="w-2 h-2 rounded-full bg-[#FAB75B] shrink-0" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
