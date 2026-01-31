const { spawn } = require('child_process');
const fs = require('fs');

console.log('Starting Next.js build...');

const buildProcess = spawn('npx.cmd', ['next', 'build'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let error = '';

buildProcess.stdout.on('data', (data) => {
  output += data.toString();
  console.log('stdout:', data.toString());
});

buildProcess.stderr.on('data', (data) => {
  error += data.toString();
  console.error('stderr:', data.toString());
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  
  // Write output to file for inspection
  fs.writeFileSync('build-output.txt', `Exit code: ${code}\n\nSTDOUT:\n${output}\n\nSTDERR:\n${error}`);
});