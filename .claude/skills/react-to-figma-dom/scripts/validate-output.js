#!/usr/bin/env node

/**
 * validate-output.js
 *
 * Validates a JSON data file against a custom schema file.
 * Hand-rolled validation — no external dependencies.
 *
 * Usage:
 *   node validate-output.js --schema <schema.json> --data <data.json>
 *
 * Exit 0 if valid, exit 1 with specific errors.
 *
 * Can also be required as a module:
 *   const { validate } = require('./validate-output');
 *   const { valid, errors } = validate(schemaPath, dataPath);
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { schema: null, data: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--schema') opts.schema = args[++i];
    if (args[i] === '--data') opts.data = args[++i];
  }
  if (!opts.schema || !opts.data) {
    console.error('Usage: node validate-output.js --schema <schema.json> --data <data.json>');
    process.exit(1);
  }
  return opts;
}

function matchesPattern(value, pattern) {
  return new RegExp(pattern).test(value);
}

function validateValue(value, spec, path, errors) {
  if (spec.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${path}: expected string, got ${typeof value}`);
      return;
    }
    if (spec.pattern && !matchesPattern(value, spec.pattern)) {
      errors.push(`${path}: "${value}" does not match pattern ${spec.pattern}`);
    }
  } else if (spec.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected array, got ${typeof value}`);
    }
  } else if (spec.type === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push(`${path}: expected object, got ${Array.isArray(value) ? 'array' : typeof value}`);
      return;
    }
    if (spec.requiredKeys) {
      for (const [key, keySpec] of Object.entries(spec.requiredKeys)) {
        if (!(key in value)) {
          errors.push(`${path}.${key}: missing required key`);
        } else {
          validateValue(value[key], keySpec, `${path}.${key}`, errors);
        }
      }
    }
  }
}

function validateValueShape(data, valueShape, errors) {
  const entries = Object.entries(data);
  const sampleSize = Math.min(entries.length, 5);
  const sample = entries.slice(0, sampleSize);

  for (const [key, value] of sample) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push(`["${key}"]: expected object value, got ${typeof value}`);
      continue;
    }
    if (valueShape.required) {
      for (const [field, fieldSpec] of Object.entries(valueShape.required)) {
        if (!(field in value)) {
          errors.push(`["${key}"].${field}: missing required field`);
        } else {
          validateValue(value[field], fieldSpec, `["${key}"].${field}`, errors);
        }
      }
    }
  }
}

function validate(schemaPath, dataPath) {
  const errors = [];

  if (!fs.existsSync(schemaPath)) {
    return { valid: false, errors: [`Schema file not found: ${schemaPath}`] };
  }
  if (!fs.existsSync(dataPath)) {
    return { valid: false, errors: [`Data file not found: ${dataPath}`] };
  }

  let schema, data;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON in schema: ${e.message}`] };
  }
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON in data: ${e.message}`] };
  }

  if (typeof data !== 'object' || data === null) {
    errors.push('Root: expected object');
    return { valid: false, errors };
  }

  const rootType = schema.type || 'object';

  if (rootType === 'non-empty-object') {
    if (Array.isArray(data)) {
      errors.push('Root: expected object, got array');
    } else if (Object.keys(data).length === 0) {
      errors.push('Root: object must not be empty');
    }
  }

  if (schema.required) {
    for (const [key, spec] of Object.entries(schema.required)) {
      if (!(key in data)) {
        errors.push(`${key}: missing required key`);
      } else {
        validateValue(data[key], spec, key, errors);
      }
    }
  }

  if (schema.valueShape && !Array.isArray(data) && Object.keys(data).length > 0) {
    validateValueShape(data, schema.valueShape, errors);
  }

  return { valid: errors.length === 0, errors };
}

if (require.main === module) {
  const opts = parseArgs();
  const result = validate(opts.schema, opts.data);

  if (result.valid) {
    const schema = JSON.parse(fs.readFileSync(opts.schema, 'utf8'));
    console.log(`PASS: ${schema.name || path.basename(opts.data)} is valid`);
    process.exit(0);
  } else {
    console.error(`FAIL: ${path.basename(opts.data)} has ${result.errors.length} error(s):`);
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
}

module.exports = { validate };
