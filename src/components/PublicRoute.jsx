import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If token exists, redirect to dashboard (prevent logged-in users from seeing login/register)
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no token, render the guest content (Login/Register)
  return <Outlet />;
};

export default PublicRoute;
