const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geoCodder = require("../utils/geocoder");
const log = require("../utils/logger");

// @desc Get bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findById(_id).populate("courses");

	if (!bootcamp) {
		log.error(`Bootcamp not found with id ${req.params.id}`);

		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
	

	res.status(200).json(res.advancedResults);
});

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findByIdAndUpdate(_id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		log.error(`Bootcamp not found with id ${req.params.id}`);
		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamp/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const _id = req.params.id;
	const bootcamp = await Bootcamp.findById(_id);

	if (!bootcamp) {
		log.error(`Bootcamp not found with id ${req.params.id}`);
		return next(
			new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
		);
	}

	await bootcamp.remove();

	res.status(200).json({ success: true });
});

// @desc Get bootcamp within a radius
// @route GET /api/v1/bootcamp/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geoCodder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	console.log(radius);

	if (bootcamps.length === 0) {
		log.error(
			"No bootcamps was found. Please expand the distance or try another zipcode"
		);
		return res.status(200).json({
			success: true,
			data:
				"No bootcamps was found. Please expand the distance or try another zipcode",
		});
	}

	res.status(200).send({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});
