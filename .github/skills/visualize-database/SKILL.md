---
name: visualize-database
description: "Visualize the database schema as an ASCII diagram. Use when asked to: show the database schema, visualize the database, show tables, show relationships, diagram the database, or understand the data model."
---

# Visualize Database Schema

Use the **Database** MCP server tools to introspect the live database and render the schema as an ASCII entity-relationship diagram.

## Steps

### 1. Discover all tables

Use `mcp_database_search_objects` to list all tables in the database.

### 2. Fetch columns and types for each table

For each table, run a SQL query via `mcp_database_execute_sql` to get column names, types, and constraints:

```sql
PRAGMA table_info('<table_name>');
```

### 3. Fetch foreign key relationships

For each table, query its foreign keys:

```sql
PRAGMA foreign_key_list('<table_name>');
```

### 4. Render the ASCII diagram

Output a diagram in this format — one box per table, with columns listed inside, and arrows showing foreign key relationships:

```
┌──────────────────────┐        ┌──────────────────────┐
│ Case                 │        │ Customer             │
│──────────────────────│        │──────────────────────│
│ PK  id         TEXT  │───────▶│ PK  id         TEXT  │
│     title      TEXT  │        │     firstName   TEXT │
│     status     TEXT  │        │     lastName    TEXT │
│ FK  customerId TEXT  │        └──────────────────────┘
│ FK  assignedTo TEXT  │
└──────────────────────┘
```

Rules:
- Mark primary keys with `PK`
- Mark foreign keys with `FK`
- Draw arrows (`───▶`) from FK columns to the PK of the referenced table
- Group tables logically (e.g. core entities first, then junction/audit tables)
- After the diagram, include a short plain-English summary of the key relationships
