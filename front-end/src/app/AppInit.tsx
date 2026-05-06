import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { preloadRoutes } from "../utils/preloadRoutes";

const AppInit = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!loading && user !== undefined) {
      preloadRoutes(user?.role);
    }
  }, [loading, user]);

  return null;
};

export default AppInit;
