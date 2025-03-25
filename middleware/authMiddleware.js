const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../utils/tokenBlacklist");

const authenticateMiddleware = (req, res, next) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header("authorization")?.split(" ")[1];

    if (!token || isBlacklisted(token)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateMiddleware;
