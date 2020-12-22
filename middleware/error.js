const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = { ...err };

	error.message = err.message;
	if (err.name === "CastError") {
		const message = `Resource was not found with id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key 11000
	if (err.code === 11000) {
		const message = `Duplicate field value entered ${JSON.stringify(err.keyValue)}`;

		error = new ErrorResponse(message, 400);
    }
    
    //Mongoose validation errors 
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
	});
};

module.exports = errorHandler;
