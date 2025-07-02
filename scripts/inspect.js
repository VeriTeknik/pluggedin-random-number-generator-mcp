#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 Starting MCP Inspector for Random Number Generator Server...\n');

const serverPath = path.join(__dirname, '..', 'dist', 'index.js');

// Run the inspector
const inspector = spawn('npx', [
  '@modelcontextprotocol/inspector',
  serverPath
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DANGEROUSLY_OMIT_AUTH: 'true' // For easier local testing
  }
});

inspector.on('error', (err) => {
  console.error('Failed to start inspector:', err);
  process.exit(1);
});

inspector.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Inspector exited with code ${code}`);
    process.exit(code);
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  inspector.kill('SIGINT');
  process.exit(0);
});