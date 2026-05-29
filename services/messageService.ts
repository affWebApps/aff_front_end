import apiClient from "@/lib/api/axios";

export interface ChatUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface MessageUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: MessageUser;
}

export interface Chat {
  id: string;
  user1_id: string;
  user2_id: string;
  user1: ChatUser;
  user2: ChatUser;
  messages: Message[];
  created_at: string;
}

export const messageService = {
  getChats: async (): Promise<Chat[]> => {
    const res = await apiClient.get<Chat[]>("/messages/chats");
    return res.data;
  },

  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    const res = await apiClient.post<Message>("/messages/send", { receiverId, content });
    return res.data;
  },

  getChatMessages: async (chatId: string): Promise<Message[]> => {
    const res = await apiClient.get(`/messages/${chatId}`);
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.messages)) return data.messages;
    return [];
  },

  markAsRead: async (chatId: string): Promise<void> => {
    await apiClient.post(`/messages/${chatId}/read`);
  },
};
