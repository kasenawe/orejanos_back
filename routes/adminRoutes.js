const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admins", adminController.index);
router.post("/", adminController.store);
router.delete("/delete/:id", adminController.destroy);
router.patch("/edit/:id", adminController.update);

module.exports = router;
