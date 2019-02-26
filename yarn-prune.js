const exec = require('child_process').exec;

const env = process.env.NODE_ENV;

if (env === 'development') {
  console.log("Do not prune in development");
  return;
}

const devDependencies = Object.keys(require('./package.json').devDependencies).join(' ');
const command = 'yarn remove ' + devDependencies;

const child = exec(command, (err, stdout, stderr) => {
  if (err) throw err;
  console.log(`stdout: \n${stdout}`);
  console.log(`stderr: \n${stderr}`);
});