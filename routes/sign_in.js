const express = require("express");
const { signInUser,googleSignInUser } = require("../controllers/authController");

const router = express.Router();

router.post("/", signInUser);

router.post("/auth/google", googleSignInUser);


module.exports = router;
