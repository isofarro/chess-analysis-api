import type { Database } from "better-sqlite3";

export interface AnalysisRow {
  createdAt: string;
  updatedAt: string;
  fen: string;
  engine: string;
  bestMove: string;
  depth: number;
  score: number;
  mate: number | null;
  time: number;
  bestMoves: string;
}

export class AnalysisRepository {
  private db: Database;
  private stmtGetByFen: any;

  constructor(db: Database) {
    this.db = db;
    // Prepare the statement once for performance
    this.stmtGetByFen = this.db.prepare<[string], AnalysisRow>(
      "SELECT * FROM analysis WHERE fen = ?",
    );
  }

  getAnalysis(fen: string): AnalysisRow[] {
    return this.stmtGetByFen.all(fen);
  }
}
