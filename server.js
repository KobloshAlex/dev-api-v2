const express = require("express");
const dotenv = require("dotenv");
const log = require("./utils/logger");
require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Routes
const bootcampsRoutes = require("./routes/bootcampsRoutes");

const app = express();

//load logger
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/bootcamps", bootcampsRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	log.info(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.underline)
);

// Handle rejections

process.on("uncaughtException", (err, promise) => {
	log.error(`Error: ${err.message}`);

	server.close(() => process.exit(1));
});
