const jwt = require("jsonwebtoken");

const authenticateMiddleware = (req, res, next) => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header("authorization").split(" ");
    console.log("token",token)
    const verified = jwt.verify(token[1], jwtSecretKey);
        
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
