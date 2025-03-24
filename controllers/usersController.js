const db = require("../config/db");

//   Get All Users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.promise().query("SELECT id, full_name, email FROM users");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

//   Search Users by Name or Email
const searchUsers = async (req, res) => {
    const { query } = req.query;
    
    try {
        const [users] = await db.promise().query(
            "SELECT id, full_name, email FROM users WHERE full_name LIKE ? OR email LIKE ?",
            [`%${query}%`, `%${query}%`]
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error searching users" });
    }
};

const getUserPublicKey = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user's public key & Gist URL from database
        const [user] = await db.promise().query(
            "SELECT public_key, gist_url FROM users WHERE id = ?", 
            [userId]
        );

        if (!user.length) return res.status(404).json({ error: "User not found" });

        res.json({
            publicKey: user[0].public_key,
            gist_url: user[0].gist_url,
        });

    } catch (error) {
        res.status(500).json({ error: "Error fetching user public key" });
    }
};

module.exports = { getAllUsers, searchUsers,getUserPublicKey };
