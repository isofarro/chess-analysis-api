import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AnalysisRepository } from "../repositories/analysis-repository.js";
import { normalizeFen, InvalidFenException } from "../utils/fen.js";

export default async function analysisRoutes(
  fastify: FastifyInstance,
  options: { repository: AnalysisRepository },
) {
  const { repository } = options;

  fastify.get(
    "/analysis/*",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Extract FEN from the wildcard path
        const params = request.params as { "*"?: string };
        const rawFenParams = params["*"];

        if (!rawFenParams) {
          return reply.status(400).send({ error: "Missing FEN string" });
        }

        // Decode URL components (handle spaces, slashes, etc.)
        const decodedFen = decodeURIComponent(rawFenParams);

        // Normalize FEN
        const normalizedFen = normalizeFen(decodedFen);

        // Query Database
        const results = repository.getAnalysis(normalizedFen);

        return results;
      } catch (error) {
        if (error instanceof InvalidFenException) {
          return reply.status(400).send({
            error: "Invalid FEN",
            message: error.message,
            providedFen: error.fen,
          });
        }

        request.log.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );
}
