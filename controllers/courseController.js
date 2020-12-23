const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const log = require("../utils/logger");
const Bootcamp = require("../models/Bootcamp");

// @desc Get courses
// @route GET /api/v1/courses/
// @route GET /api/v1/bootcamp/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });

		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}


});

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		log.error(`Course not found with id ${req.params.id}`);
		return next(
			new ErrorResponse(`Course with id ${req.params.id} was not found`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Create course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res, next) => {
	const bootcampId = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(bootcampId);

	if (!bootcamp) {
		log.error(`Bootcamp not found with id ${bootcampId}`);
		return next(
			new ErrorResponse(`Bootcamp not found with id ${bootcampId}`, 404)
		);
	}

	// Transfer bootcampId from client's request url to the body of course(bootcamp:)
	req.body.bootcamp = bootcampId;

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Update course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course;
	const courseId = req.params.id;

	course = await Course.findById(courseId);

	if (!course) {
		log.error(`Course not found with id ${courseId}`);
		return next(new ErrorResponse(`Course not found with id ${courseId}`));
	}

	course = await Course.findByIdAndUpdate(courseId, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Delete course
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const courseId = req.params.id;

	const course = await Course.findById(courseId);

	if (!course) {
		log.error(`Course not found with id ${courseId}`);
		return next(new ErrorResponse(`Course not found with id ${courseId}`));
	}

	await course.remove();

	res.status(200).json({ success: true });
});
