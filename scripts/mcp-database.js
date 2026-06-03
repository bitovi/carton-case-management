#!/usr/bin/env node
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "../packages/server/db/dev.db");

process.env.DSN = `sqlite:///${dbPath.replace(/\\/g, "/")}`;

await import("@bytebase/dbhub");
