const express = require("express");
const { getAllUsers, searchUsers,getUserPublicKey } = require("../controllers/usersController");
const authenticateMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//   Fetch All Users
router.get("/",authenticateMiddleware, getAllUsers);

//   Search Users by Name or Email
router.get("/search",authenticateMiddleware, searchUsers);

// Fetch User's Public Key & Gist URL
router.get("/:userId",authenticateMiddleware, getUserPublicKey);

module.exports = router;
