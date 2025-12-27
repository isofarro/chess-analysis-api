import Fastify from "fastify";
import cors from "@fastify/cors";
import { createDbConnection } from "./db.js";
import { AnalysisRepository } from "./repositories/analysis-repository.js";
import analysisRoutes from "./routes/analysis.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true, // Trust Nginx/Proxy headers (X-Forwarded-*)
  });

  // Setup CORS
  await app.register(cors, {
    origin: "*", // Explicitly allow all origins (avoids issues with dynamic origin reflection behind proxies)
    methods: ["GET", "HEAD", "OPTIONS"],
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
