const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.post("/", articleController.store);

router.patch("/edit/:id", articleController.update);

router.delete("/delete/:id", articleController.destroy);

module.exports = router;
