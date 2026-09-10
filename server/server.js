import app from "./app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.config.js";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

dotenv.config();
connectDB();

const PORT = env.port || 3000;

const startServer = () => {
    try {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT} (0.0.0.0)`);
        });
    } catch (err) {
        console.error("Error starting the server:", err);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();