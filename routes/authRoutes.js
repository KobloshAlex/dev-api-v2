const express = require("express");
const { authenticate } = require("../middleware/auth");
const router = express.Router();
const { register, login, getUserProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getUserProfile);

module.exports = router;
