import { Database } from "bun:sqlite";
import { readdir } from "fs/promises";
import { join } from "path";

async function push() {
  console.log("📦 Pushing database schema...");
  
  const db = new Database("sqlite.db", { create: true });
  
  // Read all migration files
  const migrationsDir = join(import.meta.dir, "../../drizzle");
  const files = await readdir(migrationsDir);
  const sqlFiles = files.filter(f => f.endsWith(".sql")).sort();
  
  for (const file of sqlFiles) {
    console.log(`Running migration: ${file}`);
    const sql = await Bun.file(join(migrationsDir, file)).text();
    
    // Split by statement-breakpoint and execute each statement
    const statements = sql.split("--> statement-breakpoint");
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        try {
          db.exec(trimmed);
        } catch (err) {
          // Ignore "table already exists" errors for idempotency
          if (!(err instanceof Error && err.message.includes("already exists"))) {
            throw err;
          }
        }
      }
    }
  }
  
  db.close();
  console.log("✅ Database schema pushed successfully!");
}

push().catch(console.error);
