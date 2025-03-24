const db = require("../config/db");

//    Fetch Messages
const getMessages = async (req, res) => {
    const { userId, receiverId } = req.params;
    console.log("WHAT")
    try {
        const [messages] = await db.promise().query(
            "SELECT sender_id, receiver_id, encrypted_for_receiver, encrypted_for_sender, signature, status FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp",
            [userId, receiverId, receiverId, userId]
        );

        await db.promise().query(
            "UPDATE messages SET status = 'read' WHERE sender_id = ? AND receiver_id = ? AND status = 'unread'",
            [receiverId, userId]
        );

        res.json(messages);
    } catch (error) {
        console.error("🔴 Error fetching messages:", error);
        res.status(500).json({ error: "Error fetching messages" });
    }
};



//    Send Encrypted Message with Signature
const sendMessage = async (req, res) => {
    const { senderId, receiverId, encryptedForReceiver, encryptedForSender, signature } = req.body;

    try {
        await db.promise().query(
            "INSERT INTO messages (sender_id, receiver_id, encrypted_for_receiver, encrypted_for_sender, signature, status) VALUES (?, ?, ?, ?, ?, 'unread')",
            [senderId, receiverId, encryptedForReceiver, encryptedForSender, signature]
        );

        res.json({ success: true });
    } catch (error) {
        console.error("🔴 Error sending message:", error);
        res.status(500).json({ error: "Error sending message" });
    }
};



// Fetch unread messages count per user
const getUnreadMessages = async (req, res) => {
    try {
        const [unreadMessages] = await db.promise().query(
            "SELECT sender_id, COUNT(*) AS unread_count FROM messages WHERE receiver_id = ? AND status = 'unread' GROUP BY sender_id",
            [req.params.userId]
        );
        const unreadCounts = {};
        unreadMessages.forEach((msg) => {
            unreadCounts[msg.sender_id] = msg.unread_count;
        });

        res.json(unreadCounts);
    } catch (error) {
        res.status(500).json({ error:error });
    }
};


module.exports = { getMessages, sendMessage, getUnreadMessages };
