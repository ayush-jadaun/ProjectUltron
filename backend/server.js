import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import scheduleUnverifiedUserCleanup from "./utils/killUnverifiedUser.js";
import userSubscriptionRoutes from "./routes/userSubscription.routes.js"
import analysisResultRoutes from "./routes/analysisResult.routes.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again later",
});

// Security middleware
app.use("/api", limiter);
app.use(helmet());
app.use(hpp());

// Logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"device-remeber-token",
			"Origin",
			"Accept",
		],
	})
);

// Database connection
connectDb();

//cron functions
scheduleUnverifiedUserCleanup();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", userSubscriptionRoutes);
app.use("/api/analysis-results", analysisResultRoutes);

// Root route
app.get("/", (req, res) => {
	res.status(200).send("Server pinged");
});

// Global Error Handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		status: "error",
		message: err.message || "Internal server error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
});

// 404 Route Handler
app.use((req, res) => {
	res.status(404).json({
		status: "error",
		message: "Route not found",
	});
});

// Start Server
app.listen(PORT, () => {
	console.log(
		`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
	);
});
