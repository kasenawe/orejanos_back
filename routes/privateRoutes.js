const passport = require("passport");
const express = require("express");
const router = express.Router();
const albumController = require("../controllers/albumController");
const { expressjwt: checkJwt } = require("express-jwt");

router.post(
  "/album",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  albumController.store,
);

router.patch(
  "/album/edit/:id",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  albumController.update,
);

router.delete(
  "/album/delete/:id",
  checkJwt({ secret: process.env.SESSION_SECRET, algorithms: ["HS256"] }),
  albumController.destroy,
);

module.exports = router;
