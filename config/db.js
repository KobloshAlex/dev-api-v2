const mongoose = require("mongoose");
const log = require("../utils/logger");
require("colors");

const connectDB = async () => {

    

	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	log.info(`MongoDB Connected: ${conn.connection.host}`.bold.yellow);
};

module.exports = connectDB;
