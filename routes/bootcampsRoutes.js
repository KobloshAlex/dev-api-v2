const express = require("express");
// Include other resource router
const coursesRouters = require("./coursesRoutes");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
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
	.post(authenticate, authorize("publisher", "admin"), createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(authenticate, authorize("publisher", "admin"), updateBootcamp)
	.delete(authenticate, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
