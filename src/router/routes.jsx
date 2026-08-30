import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import UserDetailPage from "../pages/UserDetailPage";
import MessagesPage from "../pages/MessagesPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import DashboardLayout from "../layout/DashboardLayout";

const routes = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/home",
            element: <HomePage />,
          },
          {
            path: "/explore",
            element: <ExplorePage />,
          },
          {
            path: "/messages",
            element: <MessagesPage />,
          },
          {
            path: "/notifications",
            element: <NotificationsPage />,
          },
          {
            path: "/search",
            element: <SearchPage />,
          },
          {
            path: "/user/:id",
            element: <UserDetailPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
]);

export default routes;
