import Database from "better-sqlite3";
import path from "node:path";

export function createDbConnection() {
  const dbPath = path.resolve(process.cwd(), "data/analysis.db");

  // Use URI to enable immutable mode strictly
  // file:/path/to/db?mode=ro&immutable=1
  const dbUri = `file:${dbPath}?mode=ro&immutable=1`;

  try {
    const db = new Database(dbUri, {
      readonly: true,
      fileMustExist: true,
      // better-sqlite3 treats the first argument as a filename unless we strictly rely on it parsing URIs.
      // It does not automatically enable URI filename interpretation unless built with SQLITE_USE_URI=1 or enabled via sqlite3_config.
      // However, many builds have it.
      // If this fails, we fall back to path with readonly: true.
    });

    // Optimize for read-only
    db.pragma("journal_mode = OFF");
    db.pragma("synchronous = OFF");
    db.pragma("query_only = ON");

    return db;
  } catch (e) {
    console.warn("Could not open with URI, falling back to standard path", e);
    const db = new Database(dbPath, {
      readonly: true,
      fileMustExist: true,
    });
    db.pragma("journal_mode = OFF");
    db.pragma("synchronous = OFF");
    db.pragma("query_only = ON");
    return db;
  }
}
