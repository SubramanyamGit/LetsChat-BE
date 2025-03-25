const express = require("express");
const { logoutUser } = require("../controllers/authController");
const authenticateMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateMiddleware, logoutUser);

module.exports = router;
