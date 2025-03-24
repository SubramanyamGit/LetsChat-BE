const express = require("express");
const authenticateMiddleware = require("../middleware/authMiddleware")
const { getMessages, sendMessage, getUnreadMessages } = require("../controllers/chatController");

const router = express.Router();

//   Fetch Chat Messages
router.get("/:userId/:receiverId",authenticateMiddleware, getMessages);

//   Send a Message
router.post("/send",authenticateMiddleware, sendMessage);



module.exports = router;
