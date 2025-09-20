#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

const testCommands = {
  'test': 'jest',
  'test:watch': 'jest --watch',
  'test:coverage': 'jest --coverage',
  'test:debug': 'jest --detectOpenHandles --forceExit',
  'test:verbose': 'jest --verbose',
  'test:update': 'jest --updateSnapshot',
  'test:shipgrades': 'jest ShipGrades',
  'test:crud': 'jest ShipGrades.CRUD',
};

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    if (!command || command === 'help') {
      console.log('Available test commands:');
      console.log('');
      Object.entries(testCommands).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      console.log('');
      console.log('Usage: node scripts/test-runner.js <command>');
      console.log('Example: node scripts/test-runner.js test:watch');
      return;
    }

    if (testCommands[command]) {
      console.log(`Running: ${testCommands[command]}`);
      await runCommand('npx', testCommands[command].split(' '));
    } else {
      console.error(`Unknown command: ${command}`);
      console.log('Run "node scripts/test-runner.js help" to see available commands');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running test command:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, testCommands };
