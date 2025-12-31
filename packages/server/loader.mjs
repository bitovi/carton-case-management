/**
 * TypeScript ESM Loader
 * Enables direct TypeScript execution without build step
 * Pattern from bitovi/cascade-mcp
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { config } from 'dotenv';

// Load environment variables before any TypeScript modules are loaded
config();

register('ts-node/esm', pathToFileURL('./'));
