require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

//   Centralized Routes
const routes = require("./routes");
routes.initialize(app);

//   WebSocket for Real-time Chat
io.on("connection", (socket) => {
    console.log("🔵 User connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, receiverId, encryptedForReceiver, encryptedForSender, signature,name  }) => {
        console.log("BE",senderId, receiverId, encryptedForReceiver, encryptedForSender, signature)
        db.promise().query(
            "INSERT INTO messages (sender_id, receiver_id, encrypted_for_receiver, encrypted_for_sender, signature, status) VALUES (?, ?, ?, ?, ?, 'unread')",
            [senderId, receiverId, encryptedForReceiver, encryptedForSender, signature]
        );

        io.emit(`receiveMessage-${receiverId}`, { senderId,name });
    });

    socket.on("disconnect", () => {
        console.log("  User disconnected:", socket.id);
    });
});

server.listen(5000, () => console.log("  Server running on port 5000"));
