const express = require("express");
const { signUpUser,googleSignup } = require("../controllers/authController");

const router = express.Router();
router.post("/", signUpUser);


// Google Signup Route
router.post("/auth/google", googleSignup);
module.exports = router;
