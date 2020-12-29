const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/courseController");
const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/Course");
const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(authenticate, authorize("publisher", "admin"), createCourse);
router
	.route("/:id")
	.get(getCourse)
	.put(authenticate, authorize("publisher", "admin"), updateCourse)
	.delete(authenticate, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
