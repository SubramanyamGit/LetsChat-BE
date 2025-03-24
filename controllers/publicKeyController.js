const axios = require("axios");
const db = require("../config/db");

//    Fetch Public Key from DB & GitHub Gist
const getPublicKey = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch public key from the database
        const [user] = await db.promise().query(
            "SELECT public_key, gist_url FROM users WHERE id = ?", 
            [userId]
        );

        if (!user.length) return res.status(404).json({ error: "User not found" });

        // Fetch public key from GitHub Gist
        const gistResponse = await axios.get(user[0].gist_url);
        const githubPublicKey = gistResponse.data.files["public_key.txt"].content;

        // Verify if both public keys match
        const keysMatch = user[0].public_key.trim() === githubPublicKey.trim();

        res.json({
            publicKey: user[0].public_key,
            keysMatch,
        });

    } catch (error) {
        res.status(500).json({ error: "Error fetching public key from GitHub Gist" });
    }
};

module.exports = { getPublicKey };
