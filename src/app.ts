import dotenv from "dotenv";
import express from "express";
import config from "./config/";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import menuRoutes from "./routes/menus.routes";
import restaurantRoutes from "./routes/restaurants.routes";
import geminiRoutes from "./routes/gemini.routes";

// Load environment variables
dotenv.config();

const app = express();

// Apply middleware configuration
config(app);

// Routes
app.use("/api", indexRoutes);
app.use("/auth", authRoutes);
app.use("/menus", menuRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/gemini", geminiRoutes);

export default app; 