import Fastify from "fastify";
import cors from "@fastify/cors";
import { createDbConnection } from "./db.js";
import { AnalysisRepository } from "./repositories/analysis-repository.js";
import analysisRoutes from "./routes/analysis.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Setup CORS
  await app.register(cors, {
    origin: true, // Allow all origins (for browser usage as requested)
  });

  // Setup Database and Repository
  const db = createDbConnection();
  const repository = new AnalysisRepository(db);

  // Register Routes
  // Passing repository via options
  app.register(analysisRoutes, { repository });

  // Graceful shutdown
  app.addHook("onClose", (instance, done) => {
    db.close();
    done();
  });

  return app;
}
