const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const log = require("../utils/logger");

// @desc Get bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findById(_id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findByIdAndUpdate(_id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamp/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findByIdAndDelete(_id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true });
});
