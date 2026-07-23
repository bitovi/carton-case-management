#!/usr/bin/env node
import { spawn } from 'child_process';

const CANONICAL_DATABASE_URL = 'file:../../server/db/dev.db';

process.env.DATABASE_URL ??= CANONICAL_DATABASE_URL;

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node scripts/with-db-env.mjs <command> [...args]');
  process.exit(1);
}

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
