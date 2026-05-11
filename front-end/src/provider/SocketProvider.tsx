"use client";

import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useAuthStore } from "../stores/authStore";

type Props = {
  children: React.ReactNode;
};

export default function SocketProvider({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!user || !accessToken) return;

    socket.auth = {
      accessToken,
    };

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("✅ Connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ Disconnected:", reason);
    };

    const onError = (err: Error) => {
      console.log("🚨 Socket error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
    };
  }, [user, accessToken]);

  return <>{children}</>;
}