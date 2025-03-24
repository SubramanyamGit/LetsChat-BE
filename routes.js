const signUp = require("./routes/sign_up");
const signIn = require("./routes/sign_in");
const users = require("./routes/users");
const chat = require("./routes/chat");
const message = require("./routes/messages")

module.exports.initialize = (app) => {
    console.log("   Routes Initialized");

    app.use("/sign_up", signUp);
    app.use("/sign_in", signIn);
    app.use("/users", users);
    app.use("/chat", chat);
    app.use("/messages", message);
};
