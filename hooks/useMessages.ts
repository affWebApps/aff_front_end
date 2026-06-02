"use client";
import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService, Message } from "@/services/messageService";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const useChats = () =>
  useQuery({
    queryKey: ["chats"],
    queryFn: messageService.getChats,
    staleTime: 30_000,
  });

export const useChatMessages = (chatId: string | null) =>
  useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => messageService.getChatMessages(chatId!),
    enabled: Boolean(chatId),
    staleTime: 0,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: string; content: string }) =>
      messageService.sendMessage(receiverId, content),
    onSuccess: (newMsg) => {
      queryClient.invalidateQueries({ queryKey: ["messages", newMsg.chat_id] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatId: string) => messageService.markAsRead(chatId),
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });
};

export const useRealtimeMessages = (
  chatId: string | null,
  onNewMessage: (msg: Message) => void
) => {
  const callbackRef = useRef(onNewMessage);
  callbackRef.current = onNewMessage;

  useEffect(() => {
    if (!chatId) return;
    if (process.env.NODE_ENV === "development") return;

    let supabase: ReturnType<typeof getSupabaseClient> | null = null;
    try {
      supabase = getSupabaseClient();
    } catch {
      return;
    }

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          callbackRef.current(payload.new as Message);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          supabase!.removeChannel(channel);
        }
      });

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [chatId]);
};
