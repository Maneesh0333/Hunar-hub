import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.accessToken);


  if (!token) return <Navigate to="/auth" replace />;

  switch (user?.role) {
    case "Admin":
      return <Navigate to="/admin" replace />;
    case "Entrepreneur":
      return <Navigate to="/entrepreneur" replace />;
    case "User":
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleRedirect;