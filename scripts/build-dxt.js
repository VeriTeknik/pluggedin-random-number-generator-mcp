#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildDXT() {
  console.log('Building DXT extension...');

  // Create directories
  const dxtDir = path.join(__dirname, '..', 'dxt');
  const serverDir = path.join(dxtDir, 'server');
  const distDir = path.join(__dirname, '..', 'dist');

  // Ensure directories exist
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  // Build the project
  console.log('Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  // Copy built files to DXT server directory
  console.log('Copying files to DXT structure...');
  
  // Copy dist files
  fs.cpSync(distDir, path.join(serverDir, 'dist'), { recursive: true });
  
  // Copy package.json and modify it for production
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  // Remove devDependencies and scripts not needed in production
  delete packageJson.devDependencies;
  delete packageJson.scripts.dev;
  delete packageJson.scripts.prepare;
  
  fs.writeFileSync(
    path.join(serverDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Copy node_modules (production dependencies only)
  console.log('Installing production dependencies...');
  execSync('npm install --production', { 
    stdio: 'inherit', 
    cwd: serverDir 
  });

  // Create the zip file using the system zip command
  console.log('Creating DXT package...');
  const outputFile = 'pluggedin-random-number-generator.dxt';
  
  // Remove existing file if it exists
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }
  
  // Create zip file
  execSync(`cd dxt && zip -r ../${outputFile} .`, { stdio: 'inherit' });
  
  console.log(`DXT package created: ${outputFile}`);
}

buildDXT();