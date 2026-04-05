import dotenv from "dotenv";
import http from "http";

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // ✅ attach socket
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

startServer();