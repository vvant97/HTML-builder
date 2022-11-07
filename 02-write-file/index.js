const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process;

const sayGoodbye = () => {
  stdout.write('\nGoodbye!');
  process.exit();
};

fs.writeFile(path.join(__dirname, 'text.txt'), '', error => {
  if (error) throw error;
  stdout.write('File was created\n');
});
stdout.write('Hello! Write your text\n');
process.on('SIGINT', sayGoodbye);
stdin.on('data', input => {
  if (input.toString().includes('exit\n')) sayGoodbye();

  fs.appendFile(path.join(__dirname, 'text.txt'), input, error => {
    if (error) throw error;
    stdout.write('File was updated\n');
  });
});
