import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const {
    student,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!student) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;