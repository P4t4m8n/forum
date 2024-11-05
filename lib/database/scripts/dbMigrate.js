/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "forum",
  password: "admin",
  port: 5432,
});

const migrationDir = path.join(
  "C:",
  "Users",
  "Patamon",
  "Desktop",
  "projects",
  "Next",
  "forum",
  "lib",
  "database",
  "migrations"
);

async function runMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, "utf-8");
    await pool.query(sql);
    console.log(`Successfully ran migration: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Failed to run migration: ${error.message}`);
  }
}

async function main() {
  try {
    await pool.connect();
    console.log("Connected to database");

    // Find the latest migration file based on filename timestamp
    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => b.localeCompare(a)); 

    if (files.length === 0) {
      console.log("No migration files found.");
      return;
    }

    const latestMigration = path.join(migrationDir, files[0]);
    console.log(`Running latest migration: ${files[0]}`);

    await runMigration(latestMigration);
  } finally {
    await pool.end();
    console.log("Disconnected from database");
  }
}

main().catch((error) => console.error(`Error: ${error.message}`));
