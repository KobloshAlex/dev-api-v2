const fs = require("fs");
const mongoose = require("mongoose");
require("colors");
const dotenv = require("dotenv");
const log = require("./utils/logger");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

const bootcamp = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importData = async () => {
	try {
		await Bootcamp.create(bootcamp);
		log.info("Data imported...".green);
		process.exit();
	} catch (error) {
        log.error(error);
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		log.info("Data deleted...".red);
		process.exit();
	} catch (error) {
		log.error(error);
	}
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}