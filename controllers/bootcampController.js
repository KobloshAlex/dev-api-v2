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
	const bootcamp = await Bootcamp.findById(_id);

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
	let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// Field to exclude
	const removeField = ["select", "sort", "page", "limit"];

	// Loop over removeField and delete them from reqQuery
	removeField.forEach((param) => delete reqQuery[param]);

	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// http://url?fieldName[Advance filtering abbreviation]
	// Advance filtering abbreviation
	// gt - greater than
	// gte - greater than or equal
	// lt - less than
	// lte - less than or equal
	// in - in range (exact)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, (match) => `$${match}`);

	query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

	// Select fields
	let fieldsToDisplay;
	if (req.query.select) {
		fieldsToDisplay = req.query.select.split(",").join(" ");
		query = query.select(fieldsToDisplay);
	}

	// Sort by field (ASC)
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// Build Response
	const bootcamps = await query;

	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit: limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit: limit,
		};
	}

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		pagination: pagination,
		data: bootcamps,
	});
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
    
    bootcamp.remove();

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
