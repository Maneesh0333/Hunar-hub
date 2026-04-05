import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";

import type { ApiResponse, Message } from "./useChat";


let socket: Socket;

export const useSocket = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });

    socket.emit("join", user.id);

    socket.on("receive_message", (message: Message) => {
      queryClient.setQueryData(
        ["messages", message.conversation],
        (old: ApiResponse<Message[]> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: [...old.data, message],
          };
        }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, queryClient]);

  return socket;
};