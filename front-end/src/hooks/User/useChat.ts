import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "../../lib/axios";

export type User = {
  _id: string;
  name: string;
};

export type Conversation = {
  _id: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id: string;
  conversation: string;
  sender: User;
  text: string;
  readBy: string[];
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Conversation>,
    AxiosError<ApiResponse<null>>,
    { receiverId: string }
  >({
    mutationFn: async ({ receiverId }) => {
      const res = await axiosApi.post("/chat/conversation", {
        receiverId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useConversations = () => {
  return useQuery<ApiResponse<Conversation[]>, AxiosError<ApiResponse<null>>>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await axiosApi.get("/chat/conversation");
      return data;
    },
  });
};

export type MessageResponse = {
  success: boolean;
  message: string;
  data: Message[];
};

export const useMessages = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data } = await axiosApi.get<MessageResponse>(`/chat/messages/${conversationId}`);
      return data;
    },
    enabled: !!conversationId,
  });
};

/* =========================================================
   ✅ SEND MESSAGE (API FALLBACK)
========================================================= */

export const useSendMessage = () => {
  return useMutation<
    ApiResponse<Message>,
    AxiosError<ApiResponse<null>>,
    {
      conversationId: string;
      text: string;
    }
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post("/chat/messages", payload);
      return data;
    },
  });
};

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { data } = await axiosApi.patch(
        `/chat/messages/read/${conversationId}`,
      );
      return data;
    },
  });
};
