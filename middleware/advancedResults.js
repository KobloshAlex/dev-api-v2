const { nextTick } = require("process");

const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// Field to exclude
	const removeField = ["select", "sort", "page", "limit"];

	// Loop over removeField and delete them from reqQuery
	removeField.forEach((param) => delete reqQuery[param]);

	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// http://url?fieldName[Advance filtering abbreviation]
	// Advance filtering abbreviation
	// gt - greater than
	// gte - greater than or equal
	// lt - less than
	// lte - less than or equal
	// in - in range (exact)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, (match) => `$${match}`);

	query = model.find(JSON.parse(queryStr));

	// Select fields
	let fieldsToDisplay;
	if (req.query.select) {
		fieldsToDisplay = req.query.select.split(",").join(" ");
		query = query.select(fieldsToDisplay);
	}

	// Sort by field (ASC)
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);
    
    if(populate) {
        query = query.populate(populate);
    }

	// Build Response
	const results = await query;

	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit: limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit: limit,
		};
    }
    
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination: pagination,
        data: results
    };

    next();
};

module.exports = advancedResults;