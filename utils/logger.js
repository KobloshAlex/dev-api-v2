const winston = require("winston");

const myFormatter = winston.format((info) => {
	const { message } = info;

	if (info.data) {
		info.message = `${JSON.stringify(info.data)} ${message} `;
		delete info.data; // We added `data` to the message so we can delete it
	}

	return info;
})();

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.colorize(),
        winston.format.json(),
        winston.format.splat(),

		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		myFormatter,
		winston.format.simple()
	),
	transports: [new winston.transports.Console()],
});
module.exports = logger;
