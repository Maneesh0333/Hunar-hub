import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Spinner from "./components/Shared/Spinner.tsx";
import RoleRedirect from "./components/Auth/RoleRedirect.tsx";
import Home from "./pages/Home.tsx";
import AppInit from "./app/AppInit.tsx";

const Search = lazy(() => import("./components/Search.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const ProfilePage = lazy(() => import("./components/ProfilePage.tsx"));
const Chat = lazy(() => import("./components/Chat.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const User = lazy(() => import("./pages/User.tsx"));
const UserProfile = lazy(() => import("./pages/UserProfile.tsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.tsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.tsx"));

const Entrepreneur = lazy(() => import("./pages/Entrepreneur.tsx"));
const OverviewPage = lazy(
  () => import("./components/Entrepreneur/EntrepreneursOverview.tsx"),
);
const OrdersPage = lazy(
  () => import("./components/Entrepreneur/BookingPage.tsx"),
);
const Services = lazy(() => import("./components/Entrepreneur/Services.tsx"));
const AvailabilityCalendar = lazy(
  () => import("./components/Entrepreneur/AvailabilityCalendar.tsx"),
);
const ReviewsPage = lazy(
  () => import("./components/Entrepreneur/ReviewsPage.tsx"),
);
const Profile = lazy(() => import("./components/Entrepreneur/Profile.tsx"));
const Schedule = lazy(() => import("./components/Entrepreneur/Schedule.tsx"));

const Admin = lazy(() => import("./pages/Admin.tsx"));
const Users = lazy(() => import("./components/Admin/Users.tsx"));
const Entrepreneurs = lazy(
  () => import("./components/Admin/Entrepreneurs.tsx"),
);
const AdminOverview = lazy(
  () => import("./components/Admin/AdminOverview.tsx"),
);
const EntrepreneurApplications = lazy(
  () => import("./components/Admin/EntrepreneurApplications.tsx"),
);
const Category = lazy(() => import("./components/Admin/Category.tsx"));
const Reviews = lazy(() => import("./components/Admin/Reviews.tsx"));
const Bookings = lazy(() => import("./components/Admin/AdminBookingPage.tsx"));
const Complaints = lazy(() => import("./components/Admin/Complaints.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const withSuspense = (element: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    }
  >
    {element}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleRedirect />,
    errorElement: withSuspense(<ErrorPage />),
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/search",
    element: withSuspense(<Search />),
  },
  {
    path: "/auth",
    element: withSuspense(<AuthPage />),
  },
  {
    path: "/profile/:id",
    element: withSuspense(<ProfilePage />),
  },
  {
    path: "/user",
    element: withSuspense(
      <ProtectedRoute requiredRole="User">
        <User />
      </ProtectedRoute>,
    ),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      { path: "profile", element: withSuspense(<UserProfile />) },
      { path: "orders", element: withSuspense(<MyOrders />) },
      { path: "chat", element: withSuspense(<Chat />) },
      { path: "wishlist", element: withSuspense(<Wishlist />) },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: "/entrepreneur",
    element: withSuspense(
      <ProtectedRoute requiredRole="Entrepreneur">
        <Entrepreneur />
      </ProtectedRoute>,
    ),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      { index: true, element: withSuspense(<OverviewPage />) },
      { path: "booking", element: withSuspense(<OrdersPage />) },
      { path: "services", element: withSuspense(<Services />) },
      { path: "availability", element: withSuspense(<AvailabilityCalendar />) },
      { path: "messages", element: withSuspense(<Chat />) },
      { path: "reviews", element: withSuspense(<ReviewsPage />) },
      { path: "profile", element: withSuspense(<Profile />) },
      { path: "schedule", element: withSuspense(<Schedule />) },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: "/admin",
    element: withSuspense(
      <ProtectedRoute requiredRole="Admin">
        <Admin />
      </ProtectedRoute>,
    ),
    errorElement: withSuspense(<ErrorPage />),
    children: [
      { index: true, element: withSuspense(<AdminOverview />) },
      {
        path: "approvals",
        element: withSuspense(<EntrepreneurApplications />),
      },
      { path: "users", element: withSuspense(<Users />) },
      { path: "entrepreneurs", element: withSuspense(<Entrepreneurs />) },
      { path: "bookings", element: withSuspense(<Bookings />) },
      { path: "categories", element: withSuspense(<Category />) },
      { path: "complaints", element: withSuspense(<Complaints />) },
      { path: "reviews", element: withSuspense(<Reviews />) },
      { path: "analytics", element: <>Analytics</> },
      { path: "reports", element: <>Reports</> },
      { path: "*", element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: "*",
    element: withSuspense(<NotFound />),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppInit />
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={false} />
    </QueryClientProvider>
  </StrictMode>,
);
