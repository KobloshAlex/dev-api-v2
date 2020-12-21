const Bootcamp = require("../models/Bootcamp");
const log = require("../utils/logger");

// @desc Get bootcamp
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamp = async (req, res, next) => {
	const _id = req.params.id;
	try {
		const bootcamp = await Bootcamp.findById(_id);

		if (!bootcamp) {
			return res.status(400).json({
				success: false,
				message: `bootcamp with id "${_id}" was  not found `,
			});
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getAllBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();

		res.status(200).json({
            success: true,
            count: bootcamps.length,
			data: bootcamps,
		});
	} catch (error) {
		req.status(400).json({ success: false });
	}
};

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error });
	}
};

// @desc update bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
	const _id = req.params.id;
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(_id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp) {
			return res.status(400).json({
				success: false,
				message: `bootcamp with id "${_id}" was  not found `,
			});
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamp/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
	const _id = req.params.id;
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(_id);

		if (!bootcamp) {
			return res.status(400).json({
				success: false,
				message: `bootcamp with id "${_id}" was  not found `,
			});
		}

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};
