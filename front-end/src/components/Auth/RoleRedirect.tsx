import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "../Shared/Spinner";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading || user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  switch (user?.role) {
    case "Admin":
      return <Navigate to="/admin" replace />;
    case "Entrepreneur":
      return <Navigate to="/entrepreneur" replace />;
    default:
      return <Navigate to="/home" replace />;
  }
};

export default RoleRedirect;
