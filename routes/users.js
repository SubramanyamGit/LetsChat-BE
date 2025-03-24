const express = require("express");
const { getAllUsers, searchUsers,getUserPublicKey } = require("../controllers/usersController");

const router = express.Router();

//   Fetch All Users
router.get("/", getAllUsers);

//   Search Users by Name or Email
router.get("/search", searchUsers);

// Fetch User's Public Key & Gist URL
router.get("/:userId", getUserPublicKey);

module.exports = router;

module.exports = router;
