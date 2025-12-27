import Database from "better-sqlite3";
import path from "node:path";

export function createDbConnection() {
  const dbPath = path.resolve(process.cwd(), "data/analysis.db");

  // Use URI to enable immutable mode strictly
  // Standard URI format: file:///path/to/db?mode=ro&immutable=1
  // We use file://${dbPath} which results in file:///absolute/path... on Unix
  const dbUri = `file://${dbPath}?mode=ro&immutable=1`;

  try {
    const db = new Database(dbUri, {
      readonly: true,
      fileMustExist: true,
    });

    // Optimize for read-only
    db.pragma("journal_mode = OFF");
    db.pragma("synchronous = OFF");
    db.pragma("query_only = ON");

    return db;
  } catch (e) {
    // URI mode usually fails if better-sqlite3 was not compiled with SQLITE_USE_URI.
    // This is common, so we silently fall back to standard path.
    // console.debug("Immutable mode (URI) not supported, falling back to standard read-only mode.");

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
