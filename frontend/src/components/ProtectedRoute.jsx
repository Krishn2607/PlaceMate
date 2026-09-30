import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {

  const {
    student,
    loading,
  } = useAuth();

  if (loading) {

    return (
      <div className="loading-screen">
        Loading PlaceMate...
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