import app from "./app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.config.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const PORT = env.port || 3000;

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error starting the server:", err);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();