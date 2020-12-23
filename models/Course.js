const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please add a name"],
		trim: true,
		unique: true,
		maxlength: [50, "title cannot be more than 100 characters"],
	},
	description: {
		type: String,
		required: [true, "Please add a description"],
		trim: true,
		maxlength: [500, "name cannot be more than 500 characters"],
	},
	weeks: {
		type: Number,
	},
	tuition: {
		type: Number,
	},
	minimumSkill: {
		type: [String],
		required: true,
		enum: ["beginner", "intermediate", "advance"],
	},
	scholarhipsAvailable: {
		type: Boolean,
		default: false,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        require: true,
    }
});

module.exports = mongoose.model("Course", CourseSchema);
