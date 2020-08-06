var tty = require('tty');
var ttys = require('ttys');
var readline = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

// stdout.write('hello\n');
// stdout.write('\033[1A');
// stdout.write('yu');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function ask(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

void async function() {
  console.log(await ask('your project name?'));
}();