const express = require("express");
const router = express.Router();

const albumController = require("../controllers/albumController");
const articleController = require("../controllers/articleController");
const userController = require("../controllers/adminController");

router.post("/login", userController.token);

router.get("/albums", albumController.index);

router.get("/articles", articleController.index);

router.get("/album/:slug", albumController.show);

module.exports = router;
