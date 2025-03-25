const express = require("express");
const { googleSignup } = require("../controllers/authController");

const router = express.Router();

// Google Signup Route
router.post("/auth/google", googleSignup);
module.exports = router;
