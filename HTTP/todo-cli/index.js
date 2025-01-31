const fs = require('fs');
const { Command } = require('commander');
const program = new Command();
const todosFilePath = 'todos.json';

// Function to read todos from the JSON file
function readTodos() {
    if (!fs.existsSync(todosFilePath)) {
        fs.writeFileSync(todosFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(todosFilePath);
    return JSON.parse(data);
}

// Function to save todos to the JSON file
function saveTodos(todos) {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
}

// Command to add a todo
program.command('add <task>')
    .description('Add a new todo')
    .action((task) => {
        const todos = readTodos();
        const newTodo = {
            id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
            task: task,
            done: false
        };
        todos.push(newTodo);
        saveTodos(todos);
        console.log(`Added todo: "${task}"`);
    });

// Command to delete a todo
program.command('delete <id>')
    .description('Delete a todo by ID')
    .action((id) => {
        const todos = readTodos();
        const updatedTodos = todos.filter(todo => todo.id != id);
        saveTodos(updatedTodos);
        console.log(`Deleted todo with ID: ${id}`);
    });

// Command to mark a todo as done
program.command('done <id>')
    .description('Mark a todo as done by ID')
    .action((id) => {
        const todos = readTodos();
        const todo = todos.find(todo => todo.id == id);
        if (todo) {
            todo.done = true;
            saveTodos(todos);
            console.log(`Marked todo as done: "${todo.task}"`);
        } else {
            console.log(`Todo with ID: ${id} not found.`);
        }
    });

// Parse the command line arguments
program.parse(process.argv);

// If no command was provided, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
console.log(__dirname); // Add this line to see where your script is running from
