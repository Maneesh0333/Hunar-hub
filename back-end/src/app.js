import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import entrepreneurRoutes from "./routes/entrepreneur.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import servicesRoutes from "./routes/service.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import { globalLimiter } from "./middleware/global-limiter.middleware.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(globalLimiter);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/entrepreneurs", entrepreneurRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/services", servicesRoutes);
app.use("/chat", chatRoutes);
app.use("/complaints", complaintRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
