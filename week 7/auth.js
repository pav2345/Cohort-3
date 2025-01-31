const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // Replace with your actual secret key

function auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // Attach user ID to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { auth, JWT_SECRET };











