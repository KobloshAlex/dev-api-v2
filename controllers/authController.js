const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const log = require("../utils/logger");

// @desc register a user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, role, password } = req.body;

	const user = await User.create({
		name,
		email,
		role,
		password,
	});

	const token = user.getSignedJwtToken();

	res.status(200).json({
		success: true,
		token,
	});
});

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Check if password and email in body
	if (!email || !password) {
		log.error("No email or password in request body");
		return next(new ErrorResponse("Please provide email and password", 400));
	}

	// Check if user exists
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
        log.error("user is not exist in db");
		return next(new ErrorResponse("Invalid credentials", 403));
    }
    
    // Check if password exists
    const isPassword = await user.matchPassword(password);
    if(!isPassword) {
        log.error("password is not exist in db");
		return next(new ErrorResponse("Invalid credentials", 403));
    }

	const token = user.getSignedJwtToken();

	res.status(200).json({
		success: true,
		token,
	});
});
