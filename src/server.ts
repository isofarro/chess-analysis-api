import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp();
  try {
    const port = Number(process.env.PORT) || 2851;
    await app.listen({ port, host: "127.0.0.1" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
