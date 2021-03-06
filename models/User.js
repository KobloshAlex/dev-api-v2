const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
		required: true,
		unique: true,
	},
	role: {
		type: String,
		required: true,
		enum: ["user", "publisher"],
	},
	password: {
		type: String,
		required: [true, "Please add a password"],
		minLength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXP,
	});
};

UserSchema.methods.matchPassword = async function (requestPassword) {
	return await bcrypt.compare(requestPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
