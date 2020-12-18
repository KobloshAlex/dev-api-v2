
// @desc Get bootcamp
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "get" });
};

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "getAll" });
};

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "post" });
};

// @desc update bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "put" });
};

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamp/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "delete" });
};

