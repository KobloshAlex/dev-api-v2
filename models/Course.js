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
	},
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: "$bootcamp",
				averageCost: { $avg: "$tuition" },
			},
		},
	]);
	console.log(obj);

	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (error) {
		console.error(error);
	}
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
	this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost before remove save
CourseSchema.pre("remove", function () {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
