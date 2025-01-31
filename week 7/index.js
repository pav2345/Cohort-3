const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Added missing bcrypt import
const { auth, JWT_SECRET } = require("./auth");
const {z}=require("zod")

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://99210042028:j6NI9Q5K4J25NXKZ@cluster0.hys8q.mongodb.net/todo-app-database");

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const requireBody=z.Bodyobject({
        email:z.string().min(5).max(30).email(),
        name:string().min(6).max(25).name(),
        password:z.string(8).min().max(15).password(),

    })
    const parsedDatawithSucess=requireBody.safeParse(req.body);

    if (!parsedDatawithSucess.sucess){
        res.json({
            message:"incorrect format"
        })
        return
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const hashPassword = await bcrypt.hash(password, 5); // Fixed typo here

    await UserModel.create({
        email: email,
        password: hashPassword, // Fixed typo here
        name: name
    });

    res.json({
        message: "You are signed up"
    });
});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({ email: email });
    if (response && await bcrypt.compare(password, response.password)) { // Fixed bcrypt comparison
        const token = jwt.sign({ id: response._id.toString() }, JWT_SECRET);

        res.json({
            token
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

app.post("/todo", auth, function (req, res) {
    const userId = req.userId;
    // Add logic for creating a todo
});

app.get("/todos", auth, function (req, res) {
    const userId = req.userId;
    // Add logic for fetching todos
});

app.listen(3000);
console.log("successful into port");
