const express = require("express");
const router = express.Router();
const {
	getBootcamp,
	getAllBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../controllers/bootcampController");

router.route("/").get(getAllBootcamps).post(createBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
