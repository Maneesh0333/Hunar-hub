import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Spinner from "./Shared/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "Admin" | "User" | "Entrepreneur";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading || user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
