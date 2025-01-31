const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .name('counter')
  .description('CLI to do file based tasks')
  .version('0.8.0');

program.command('count')
  .description('Count the number of lines in a file')
  .argument('<file>', 'file to count')
  .action((file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
<<<<<<< HEAD
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
=======
<<<<<<< HEAD
        console.log(err);
=======
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
>>>>>>> d86a55795a7297c10a5173ff0674a64c3e0a0daa
>>>>>>> a4f8054 (These week 4.2)
      } else {
        const lines = data.split('\n').length;
        console.log(`There are ${lines} lines in ${file}`);
      }
    });
  });

<<<<<<< HEAD
program.parse(process.argv);
=======
<<<<<<< HEAD
program.parse();
=======
program.parse(process.argv);
>>>>>>> d86a55795a7297c10a5173ff0674a64c3e0a0daa
>>>>>>> a4f8054 (These week 4.2)
