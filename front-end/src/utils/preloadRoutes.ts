export const preloadRoutes = (
  role: "Admin" | "Entrepreneur" | "User" | undefined,
) => {
  switch (role) {
    case "Admin":
      import("../pages/Admin.tsx");
      import("../components/Admin/AdminOverview.tsx");
      import("../components/Admin/EntrepreneurApplications.tsx");
      import("../components/Admin/Users.tsx");
      import("../components/Admin/Entrepreneurs.tsx");
      import("../components/Admin/AdminBookingPage.tsx");
      import("../components/Admin/Category.tsx");
      import("../components/Admin/Complaints.tsx");
      import("../components/Admin/Reviews.tsx");
      break;

    case "Entrepreneur":
      import("../pages/Entrepreneur.tsx");
      import("../components/Entrepreneur/EntrepreneursOverview.tsx");
      import("../components/Entrepreneur/BookingPage.tsx");
      import("../components/Entrepreneur/ReviewsPage.tsx");
      import("../components/Entrepreneur/Profile.tsx");
      import("../components/Entrepreneur/Services.tsx");
      import("../components/Entrepreneur/AvailabilityCalendar.tsx");
      import("../components/Entrepreneur/Schedule.tsx");
      import("../components/Chat.tsx");
      import("../components/Entrepreneur/Earning.tsx");
      break;

    case "User":
      import("../pages/User.tsx");
      import("../pages/UserProfile.tsx");
      import("../pages/MyOrders.tsx");
      import("../pages/Wishlist.tsx");
      import("../components/Chat.tsx");
      import("../components/Categories");
      break;

    default:
      import("../pages/AuthPage.tsx");
      import("../components/Search.tsx");
      import("../components/ProfilePage.tsx");
      import("../components/Categories");
  }
};
