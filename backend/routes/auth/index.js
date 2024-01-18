var express = require("express");
const authController = require("../../controllers/auth.controller");
var router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
