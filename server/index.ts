import "dotenv/config";
import express from "express";
import path from "node:path";
import { initializeDatabase, pool } from "./db";
import { registerRoutes } from "./routes";

const app = express();
const port = Number(process.env.PORT || 5000);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false }));

await initializeDatabase();
registerRoutes(app);

if (process.env.NODE_ENV === "development") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const publicDirectory = path.resolve(process.cwd(), "dist/public");
  app.use(express.static(publicDirectory));
  app.get("*", (_request, response) => {
    response.sendFile(path.join(publicDirectory, "index.html"));
  });
}

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`\n✅ FiestaSIDI 2026 está funcionando en http://localhost:${port}`);
  console.log("✅ Base de datos PostgreSQL/Neon conectada.");
  console.log("ℹ️  Con XAMPP configurado abre http://fiestasidi.local:PUERTO\n");
});

async function shutdown(signal: string) {
  console.log(`\n${signal}: cerrando FiestaSIDI...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
