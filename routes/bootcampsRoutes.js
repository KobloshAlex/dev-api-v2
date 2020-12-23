const express = require("express");
// Include other resource router
const coursesRouters = require("./coursesRoutes");
const router = express.Router();
const {
	getBootcamp,
	getAllBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require("../controllers/bootcampController");

// Re-route into other resource routes
router.use("/:bootcampId/courses", coursesRouters);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getAllBootcamps).post(createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
