const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "PavanKumarilove";

const app = express();
app.use(express.json());

const users = [];

// Logger middleware
function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

// Serve HTML file for the root route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Signup route
app.post("/signup", logger, function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.push({ username, password });

    res.json({
        message: "You are signed up"
    });
});

// Signin route
app.post("/signin", logger, function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    // Find the user in the users array
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (!foundUser) {
        // Return a 401 Unauthorized status if credentials are incorrect
        return res.status(401).json({
            message: "Credentials are incorrect"
        });
    } else {
        // Create JWT token
        const token = jwt.sign({ username: foundUser.username }, JWT_SECRET);
        
        // Add token to response header and body
        res.header("Authorization", `Bearer ${token}`);
        res.json({
            token: token
        });
    }
});

// Auth middleware to verify JWT
function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.username = decodedData.username;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token is invalid" });
    }
}

// Protected route to get user information
app.get("/me", logger, auth, function (req, res) {
    const currentUser = req.username;
    let foundUser = null;  // Initialize foundUser as null

    // Find the current user in the users array
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === currentUser) {
            foundUser = users[i];
        }
    }

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        });
    } else {
        res.status(404).json({
            message: "User not found"
        });
    }
});

// Start the server
app.listen(8080, () => {
    console.log("Successfully started server on port 3000");
});
