export const preloadRoutes = (
  role: "Admin" | "Entrepreneur" | "User" | undefined,
) => {
  switch (role) {
    case "Admin":
      import("../pages/Admin.tsx");
      import("../components/Admin/AdminOverview.tsx");
      break;

    case "Entrepreneur":
      import("../pages/Entrepreneur.tsx");
      import("../components/Entrepreneur/EntrepreneursOverview.tsx");
      import("../components/Entrepreneur/BookingPage.tsx");
      import("../components/Entrepreneur/ReviewsPage.tsx");
      break;

    case "User":
      import("../pages/User.tsx");
      break;

    default:
      import("../pages/AuthPage.tsx");
  }
};
