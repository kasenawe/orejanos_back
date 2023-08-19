const passport = require("passport");
const express = require("express");
const router = express.Router();
const albumRoutes = require("./albumRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/album", albumRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
