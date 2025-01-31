const express = require("express");

const app = express();

app.use(express.json());

let Todo = [];

// Get listing of all tasks
app.get("/task", (req, res) => {
    res.json(Todo);
});

// Create a new task
app.post("/task", (req, res) => {
    const { title, description } = req.body;
    const newTodo = {
        id: Todo.length + 1,
        title,
        description,
    };
    Todo.push(newTodo);
    res.status(201).json(newTodo);
});

// Get a specific task by id
app.get("/task/:id", (req, res) => {
    const task = Todo.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// Update a task by id
app.put("/task/:id", (req, res) => {
    const task = Todo.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    res.json(task);
});

// Delete a task by id
app.delete("/task/:id", (req, res) => {
    Todo = Todo.filter(t => t.id !== parseInt(req.params.id));
    res.json({ message: 'Task deleted' });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
