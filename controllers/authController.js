const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { addToBlacklist } = require("../utils/tokenBlacklist");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GitHub Personal Access Token (Generate from https://github.com/settings/tokens)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

// Function to upload public key to GitHub Gist
async function uploadPublicKeyToGist(userId, publicKey) {
    const gistData = {
        description: `Public key for ${userId}`,
        public: true, // Set to false if you want private Gists
        files: {
            [`${userId}_public_key.txt`]: {
                content: publicKey
            }
        }
    };

    try {
        const response = await axios.post("https://api.github.com/gists", gistData, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            }
        });

        return response.data.html_url; // Return the Gist URL
    } catch (error) {
        console.error("Error creating Gist:", error.response?.data || error.message);
        throw new Error("Failed to store public key in GitHub Gist.");
    }
}

// Google Signup
const googleSignup = async (req, res) => {
    const { token, email, full_name, publicKey } = req.body;

    try {
        // Verify Google Token
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (payload.email !== email) return res.status(401).json({ error: "Invalid Google Credentials" });

        // Check if user already exists
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length) {
            return res.status(400).json({ error: "User already Signed Up, proceed to Sign In" });
        }

        // Upload Public Key to GitHub Gist
        const gistUrl = await uploadPublicKeyToGist(email, publicKey);

        // Insert new user into database
        await db.promise().query(
            "INSERT INTO users (full_name, email, oauth_provider, gist_url, public_key) VALUES (?, ?, ?, ?, ?)", 
            [full_name, email, "google", gistUrl, publicKey] 
        );

        res.json({ message: "Google Signup Successful" });

    } catch (error) {
        res.status(500).json({ error: error.message || "Google Signup Failed" });
    }
};

// Google Sign-in
const googleSignInUser = async (req, res) => {
    const { token, email } = req.body;

    if (!token || !email) {
        return res.status(400).json({ error: "Missing token or email" });
    }

    try {
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        console.log("VERIFIED", payload.email_verified);
        if (payload.email !== email) {
            return res.status(401).json({ error: "Invalid Google Credentials" });
        }
        console.log("Errorrr",email)
        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (!users.length) {
            return res.status(404).json({ error: "User not found. Please Sign Up first." });
        }
       

        const authToken = jwt.sign({ userId: users[0].id, email }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

        res.json({ token: authToken, userData: {userId: users[0].id,gistUrl: users[0].gist_url,email:users[0].email,publicKey:users[0].public_key,name:users[0].full_name}, });
    } catch (error) {
        res.status(500).json({ error: error.message || "Google Sign-In Failed" });
    }
};


const logoutUser = (req, res) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (token) {
        addToBlacklist(token);
        return res.json({ message: "Logout successful" });
    }
    return res.status(400).json({ message: "Token missing" });
};


module.exports = { googleSignup, googleSignInUser,logoutUser };
