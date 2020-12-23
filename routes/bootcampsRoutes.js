const express = require("express");
// Include other resource router
const coursesRouters = require("./coursesRoutes");
const router = express.Router();
const advancedResults = require("../middleware/advancedResults");
const {
	getBootcamp,
	getAllBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require("../controllers/bootcampController");
const Bootcamp = require("../models/Bootcamp");

// Re-route into other resource routes
router.use("/:bootcampId/courses", coursesRouters);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
	.post(createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
