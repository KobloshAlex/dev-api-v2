const express = require("express");
const dotenv = require("dotenv");
const log4js = require("log4js");
// Routes
const bootcampsRoutes = require("./routes/bootcampsRoutes");

//logger
const log = log4js.getLogger();
log.level = "debug";

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Mount Routes
app.use("/api/v1/bootcamps", bootcampsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	log.debug(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
