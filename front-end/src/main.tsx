import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Search from "./components/Search.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import { Toaster } from "react-hot-toast";
import OverviewPage from "./components/Entrepreneur/EntrepreneursOverview.tsx";
import OrdersPage from "./components/Entrepreneur/BookingPage.tsx";
import AvailabilityCalendar from "./components/Entrepreneur/AvailabilityCalendar.tsx";

import ProfilePage from "./components/ProfilePage.tsx";
import Chat from "./components/Chat.tsx";
import ReviewsPage from "./components/Entrepreneur/ReviewsPage.tsx";
import Profile from "./components/Entrepreneur/Profile.tsx";
import Schedule from "./components/Entrepreneur/Schedule.tsx";
import Admin from "./pages/Admin.tsx";
import Users from "./components/Admin/Users.tsx";
import Entrepreneurs from "./components/Admin/Entrepreneurs.tsx";
import AdminOverview from "./components/Admin/AdminOverview.tsx";
import EntrepreneurApplications from "./components/Admin/EntrepreneurApplications.tsx";
import Category from "./components/Admin/Category.tsx";
import Reviews from "./components/Admin/Reviews.tsx";
import Orders from "./components/Admin/Orders.tsx";
import Complaints from "./components/Admin/Complaints.tsx";
import User from "./pages/User.tsx";
import UserHomePage from "./pages/UserHomePage.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import MyOrders from "./pages/MyOrders.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RoleRedirect from "./components/Auth/RoleRedirect.tsx";
import Entrepreneur from "./pages/Entrepreneur.tsx";
import Services from "./components/Entrepreneur/Services.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/redirect",
    element: <RoleRedirect />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },
  {
    path: "/user",
    element: <User />,
    children: [
      {
        index: true,
        element: <UserHomePage />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
    ],
  },
  {
    path: "/entrepreneur",
    element: (
      <ProtectedRoute requiredRole="Entrepreneur">
        <Entrepreneur />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "booking",
        element: <OrdersPage />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "availability",
        element: <AvailabilityCalendar />,
      },
      {
        path: "messages",
        element: <Chat />,
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="Admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: "approvals",
        element: <EntrepreneurApplications />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "entrepreneurs",
        element: <Entrepreneurs />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "complaints",
        element: <Complaints />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "analytics",
        element: <>Analytics</>,
      },
      {
        path: "reports",
        element: <>Reports</>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </QueryClientProvider>
  </StrictMode>,
);
