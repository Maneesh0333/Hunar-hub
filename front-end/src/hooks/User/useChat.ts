import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  lastMessage: string;
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

type ApiResponseConversations = {
  success: boolean;
  message: string;
  data: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export const useConversations = (search: string = "", limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["conversations", search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosApi.get<ApiResponseConversations>(
        "/chat/conversation",
        {
          params: { search, page: pageParam, limit },
        },
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },

    initialPageParam: 1,
  });
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse,
    AxiosError<ApiResponse>,
    { receiverId: string | undefined }
  >({
    mutationFn: async ({ receiverId }) => {
      const res = await axiosApi.post<ApiResponse>("/chat/conversation", {
        receiverId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
      const { data } = await axiosApi.get<MessageResponse>(
        `/chat/messages/${conversationId}`,
      );
      return data;
    },
    enabled: !!conversationId,
  });
};

// /* =========================================================
//    ✅ SEND MESSAGE (API FALLBACK)
// ========================================================= */

// export const useSendMessage = () => {
//   return useMutation<
//     ApiResponse<Message>,
//     AxiosError<ApiResponse<null>>,
//     {
//       conversationId: string;
//       text: string;
//     }
//   >({
//     mutationFn: async (payload) => {
//       const { data } = await axiosApi.post("/chat/messages", payload);
//       return data;
//     },
//   });
// };

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { data } = await axiosApi.patch<ApiResponse>(
        `/chat/messages/read/${conversationId}`,
      );
      return data;
    },
  });
};
