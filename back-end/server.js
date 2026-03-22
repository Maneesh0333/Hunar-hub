import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000;
if (!PORT) {
  throw new Error("PORT is not defined in environment variables");
}


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...\n`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart dead workers
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // Each worker connects to DB
  const startServer = async () => {
    try {
      await connectDB(); // ✅ each worker has its own DB connection

      app.listen(PORT, () => {
        console.log(`🚀 Worker ${process.pid} running on port ${PORT}`);
      });

    } catch (err) {
      console.error("DB connection failed:", err);
      process.exit(1);
    }
  };

  startServer();
}