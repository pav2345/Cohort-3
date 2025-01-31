const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const JWT_SECRET = "pavan_kumar";
app.use(express.static('public'));
app.use(express.json());

const users = [];
const todos = {};

// Middleware to log requests
function logger(req, res, next) {
    console.log(`${req.method} request came`);
    next();
}

app.use(logger);

// Middleware to check JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}



// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Signup route
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    todos[username] = []; // Initialize an empty todo list for the user
    res.json({ message: "You are signed up" });
});

// Signin route
app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find(user => user.username === username && user.password === password);
    if (!foundUser) {
        return res.status(401).json({ message: "Credentials are incorrect" });
    }

    const token = jwt.sign({ username: foundUser.username }, JWT_SECRET);
    res.header("Authorization", `Bearer ${token}`).json({ token });
});

// Create TODO
app.post("/todos", authenticateToken, (req, res) => {
    const { task } = req.body;
    if (!todos[req.user.username]) todos[req.user.username] = [];
    todos[req.user.username].push({ task, done: false });
    res.json({ message: "Todo is created", todos: todos[req.user.username] });
});

// Get TODOs
app.get("/todos", authenticateToken, (req, res) => {
    res.json({ todos: todos[req.user.username] });
});

// Update TODO (mark as done)
app.put("/todos/:index", authenticateToken, (req, res) => {
    const { index } = req.params;
    if (todos[req.user.username] && todos[req.user.username][index]) {
        todos[req.user.username][index].done = true;
        res.json({ message: "Todo marked as done", todos: todos[req.user.username] });
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

// Delete TODO
app.delete("/todos/:index", authenticateToken, (req, res) => {
    const { index } = req.params;
    if (todos[req.user.username] && todos[req.user.username][index]) {
        todos[req.user.username].splice(index, 1);
        res.json({ message: "Todo is deleted", todos: todos[req.user.username] });
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

app.listen(8080)
