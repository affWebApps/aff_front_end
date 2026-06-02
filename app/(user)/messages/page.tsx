"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Send, X, UserSearch as SearchUser } from "lucide-react";
import { useState } from "react";
import { useChats, useSendMessage } from "@/hooks/useMessages";
import { useUser } from "@/hooks/useUsers";
import { ChatList } from "@/components/messages/ChatList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { UserSearch } from "@/components/messages/UserSearch";
import { Chat } from "@/services/messageService";

function StartChatPanel({ userId, onChatCreated }: { userId: string; onChatCreated: (chatId: string) => void }) {
  const { data: targetUser } = useUser(userId);
  const { mutate: send, isPending } = useSendMessage();
  const [text, setText] = useState("");

  const name =
    targetUser?.display_name ||
    `${targetUser?.first_name ?? ""} ${targetUser?.last_name ?? ""}`.trim() ||
    "User";

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    send(
      { receiverId: userId, content: trimmed },
      {
        onSuccess: (msg) => {
          onChatCreated(msg.chat_id);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden">
          {targetUser?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={targetUser.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="font-semibold text-gray-900">{name}</span>
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p className="text-sm">Send a message to start the conversation.</p>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent transition-all"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isPending}
            className="w-10 h-10 rounded-full bg-[#FAB75B] text-white flex items-center justify-center hover:bg-amber-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat");
  const targetUserId = searchParams.get("userId");

  const { data: chats = [], isLoading } = useChats();
  const [showSearch, setShowSearch] = useState(false);

  // If a userId param is present and there's already a chat with that user, redirect to it
  useEffect(() => {
    if (!targetUserId || chatId) return;
    const existing = chats.find(
      (c) => c.user1_id === targetUserId || c.user2_id === targetUserId
    );
    if (existing) {
      router.replace(`/messages?chat=${existing.id}`);
    }
  }, [targetUserId, chats, chatId, router]);

  const selectedChat: Chat | null = chatId ? (chats.find((c) => c.id === chatId) ?? null) : null;
  const showNewChat = Boolean(targetUserId && !chatId && !selectedChat);

  const handleSelectChat = (chat: Chat) => {
    router.replace(`/messages?chat=${chat.id}`);
  };

  const handleBack = () => {
    router.replace("/messages");
  };

  const handleChatCreated = (newChatId: string) => {
    router.replace(`/messages?chat=${newChatId}`);
  };

  const handleSelectUser = (userId: string) => {
    setShowSearch(false);
    router.replace(`/messages?userId=${userId}`);
  };

  const showRightPanel = selectedChat !== null || showNewChat || Boolean(chatId);

  return (
    <div className="h-full flex rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Left: Chat List — hidden on mobile when a chat is open */}
      <div
        className={`w-full lg:w-80 shrink-0 border-r border-gray-200 flex flex-col ${showRightPanel ? "hidden lg:flex" : "flex"
          }`}
      >
        <div className="px-4 py-3 border-b border-gray-200 shrink-0 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-lg">Messages</h2>
          <div className="relative group">
            <button
              onClick={() => setShowSearch((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label={showSearch ? "Back to chats" : "Search user"}
            >
              {showSearch ? <X size={18} /> : <SearchUser size={18} />}
            </button>
            {!showSearch && (
              <span className="pointer-events-none absolute right-0 top-full mt-1 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Search user
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {showSearch ? (
            <UserSearch onSelectUser={handleSelectUser} />
          ) : isLoading ? (
            <div className="flex justify-center pt-10">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ChatList
              chats={chats}
              selectedChatId={chatId}
              onSelectChat={handleSelectChat}
            />
          )}
        </div>
      </div>

      {/* Right: Chat Window — hidden on mobile when nothing selected */}
      <div className={`flex-1 flex-col ${showRightPanel ? "flex" : "hidden lg:flex"}`}>
        {selectedChat ? (
          <ChatWindow chat={selectedChat} onBack={handleBack} />
        ) : chatId && isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : showNewChat ? (
          <StartChatPanel userId={targetUserId!} onChatCreated={handleChatCreated} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <MessageCircle className="w-16 h-16 opacity-20" />
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  );
}
