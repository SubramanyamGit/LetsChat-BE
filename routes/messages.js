const express = require("express");
const authenticateMiddleware = require("../middleware/authMiddleware")
const {  getUnreadMessages } = require("../controllers/chatController");

const router = express.Router();

router.get("/unread/:userId",authenticateMiddleware, getUnreadMessages);



module.exports = router;
