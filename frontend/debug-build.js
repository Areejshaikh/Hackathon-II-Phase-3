const { spawn } = require('child_process');

console.log('Starting Next.js build...');

const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: __dirname,
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
});