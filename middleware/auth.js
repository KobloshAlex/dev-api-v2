const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorHandler = require("../utils/errorResponse");
const User = require("../models/User");

exports.authenticate = asyncHandler(async (req, res, next) => {
	let token;
	const authorization = req.headers.authorization;
	if (authorization && authorization.startsWith("Bearer")) {
		token = authorization.split(" ")[1];
	}

	// Make sure token exists
	if (!token) {
		return next(new ErrorHandler("Not authorize to access this resource", 401));
	}

	// Verify token
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decodedToken);
		req.user = await User.findById(decodedToken.id);

		next();
	} catch (error) {
		return next(
			new ErrorHandler(
				`Not authorize to access this resource.[ ${error} ]`,
				401
			)
		);
	}
});

exports.authorize = (...roles) => {
	return (req, res, next) => {
        console.log(req.user.role);
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					`User with role ${req.user.role} is not authorized to access this resource`,
					403
				)
			);
        }
        next();
	};
};
