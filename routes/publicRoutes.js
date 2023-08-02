const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const albumController = require("../controllers/albumController");
const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");

router.get("/", pagesController.showHome);

router.post("/login", userController.token);

router.get("/albums", albumController.index);

router.get("/articles", articleController.index);

router.get("/album/:slug", albumController.show);

router.get("*", function (req, res) {
  res.status(404).render("pages/404");
});

module.exports = router;