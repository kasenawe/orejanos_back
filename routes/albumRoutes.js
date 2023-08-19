const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");

router.post("/", albumController.store);

router.patch("/add/:id", albumController.addPhoto);

router.patch("/edit/photo/:id", albumController.updatePhoto);

router.patch("/edit/:id", albumController.update);

router.delete("/delete/:id", albumController.destroy);

router.delete("/delete/image/:id", albumController.destroyImage);

module.exports = router;
