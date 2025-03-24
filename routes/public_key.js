const express = require("express");
const authenticateMiddleware = require("../middleware/authMiddleware")
const { getPublicKey } = require("../controllers/publicKeyController");

const router = express.Router();

//    Route to fetch & verify public key from Backend & GitHub Gist
router.get("/:userId",authenticateMiddleware, getPublicKey);

module.exports = router;
