const express = require("express");
const dotenv = require("dotenv");
const log = require("./utils/logger");
require("colors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Routes
const bootcampsRoutes = require("./routes/bootcampsRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Body parser
app.use(express.json());

// load morgan
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/bootcamps", bootcampsRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	log.info(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.underline)
);

// Handle rejections

process.on("uncaughtException", (err) => {
	log.error(`Error: ${err.message}`);

	server.close(() => process.exit(1));
});
