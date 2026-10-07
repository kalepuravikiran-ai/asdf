const { spawn } = require('child_process');

function startTunnel() {
  console.log('[Tunnel] Launching localtunnel on port 5173...');
  const lt = spawn('npx', ['-y', 'localtunnel', '--port', '5173'], {
    shell: true,
    stdio: 'inherit'
  });

  lt.on('close', (code) => {
    console.log(`[Tunnel] Process exited with code ${code}. Restarting in 5s...`);
    setTimeout(startTunnel, 5000);
  });
}

startTunnel();
