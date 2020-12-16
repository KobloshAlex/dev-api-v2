const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).json({ success: true, msg: "get" });
});

router.get("/:id", (req, res) => {
	res.status(200).json({ success: true, msg: "getAll" });
});

router.post("/", (req, res) => {
	res.status(200).json({ success: true, msg: "post" });
});

router.put("/:id", (req, res) => {
	res.status(200).json({ success: true, msg: "put" });
});

router.delete("/:id", (req, res) => {
	res.status(200).json({ success: true, msg: "delete" });
});

module.exports = router;
