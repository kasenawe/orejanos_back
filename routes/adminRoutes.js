const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/admins", userController.index);

module.exports = router;