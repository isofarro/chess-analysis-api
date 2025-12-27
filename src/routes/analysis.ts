import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AnalysisRepository } from "../repositories/analysis-repository.js";
import { normalizeFen, InvalidFenException } from "../utils/fen.js";

export default async function analysisRoutes(
  fastify: FastifyInstance,
  options: { repository: AnalysisRepository },
) {
  const { repository } = options;

  fastify.get(
    "/analysis/:fen",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const params = request.params as { fen: string };
        const rawFen = params.fen;

        if (!rawFen) {
          return reply.status(400).send({ error: "Missing FEN string" });
        }

        // Normalize FEN (Fastify automatically decodes the URL parameter)
        const normalizedFen = normalizeFen(rawFen);

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
