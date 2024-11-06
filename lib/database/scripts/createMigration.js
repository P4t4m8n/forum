/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join("lib/database", 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir);
}

const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14); // Format: YYYYMMDDHHMMSS
const migrationFilename = `${timestamp}_migration.sql`;
const migrationPath = path.join(migrationsDir, migrationFilename);

const migrationTemplate = `-- Migration: ${migrationFilename}
-- Up migration
BEGIN;

-- Write your migration commands here
-- Example:
-- ALTER TABLE your_table ADD COLUMN example_column INT;

COMMIT;

-- Down migration
BEGIN;

-- Write your rollback commands here
-- Example:
-- ALTER TABLE your_table DROP COLUMN example_column;

COMMIT;
`;

fs.writeFileSync(migrationPath, migrationTemplate);
console.info(`Migration file created: ${migrationPath}`);
