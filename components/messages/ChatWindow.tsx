"use client";
import { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Message, Chat } from "@/services/messageService";
import { useAuthStore } from "@/store/authStore";
import {
  useChatMessages,
  useSendMessage,
  useMarkAsRead,
  useRealtimeMessages,
} from "@/hooks/useMessages";

interface ChatWindowProps {
  chat: Chat;
  onBack?: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const { user } = useAuthStore();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const other = chat.user1_id === user?.id ? chat.user2 : chat.user1;
  const otherName = `${other?.first_name ?? ""} ${other?.last_name ?? ""}`.trim() || "Unknown";

  const { data: messages = [], isLoading } = useChatMessages(chat.id);
  const { mutate: send, isPending: sending } = useSendMessage();
  const { mutate: markRead } = useMarkAsRead();

  // Mark as read when this chat is opened
  useEffect(() => {
    markRead(chat.id);
  }, [chat.id, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime: append incoming messages from the other participant
  useRealtimeMessages(chat.id, (newMsg) => {
    queryClient.setQueryData<Message[]>(["messages", chat.id], (old = []) => {
      if (old.find((m) => m.id === newMsg.id)) return old;
      return [...old, newMsg];
    });
    markRead(chat.id);
  });

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !other) return;

    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic: Message = {
      id: optimisticId,
      chat_id: chat.id,
      sender_id: user?.id ?? "",
      receiver_id: other?.id ?? "",
      content: trimmed,
      read: false,
      created_at: new Date().toISOString(),
    };

    queryClient.setQueryData<Message[]>(["messages", chat.id], (old = []) => [
      ...old,
      optimistic,
    ]);
    setText("");
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "40px";

    send(
      { receiverId: other?.id ?? "", content: trimmed },
      {
        onError: () => {
          queryClient.setQueryData<Message[]>(["messages", chat.id], (old = []) =>
            old.filter((m) => m.id !== optimisticId)
          );
          setText(trimmed);
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-grow textarea
    e.target.style.height = "40px";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800 mr-1 lg:hidden"
            aria-label="Back to chats"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden">
          {other?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={other.avatar_url}
              alt={otherName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm">{otherName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="font-semibold text-gray-900">{otherName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center pt-10">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 pt-10">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    isOwn
                      ? "bg-[#FAB75B] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  } ${msg.id.startsWith("optimistic-") ? "opacity-60" : ""}`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB75B] focus:border-transparent transition-all overflow-hidden"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
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
