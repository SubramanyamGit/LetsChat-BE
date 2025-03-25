const express = require("express");
const { googleSignInUser } = require("../controllers/authController");

const router = express.Router();

router.post("/auth/google", googleSignInUser);


module.exports = router;
