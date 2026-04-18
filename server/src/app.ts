import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./createApp";
import { createIndicatorRepository } from "./config/repositoryFactory";
import { IndicatorService } from "./services/indicatorService";
import indicadoresData from "../../data/indicadores.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Handle both old { indicadores, reportesAgrupados } and new [ ... ] formats
  const rawIndicators = Array.isArray(indicadoresData) 
    ? indicadoresData 
    : (indicadoresData as any).indicadores || [];
  
  const rawReports = Array.isArray(indicadoresData) 
    ? [] 
    : (indicadoresData as any).reportesAgrupados || [];

  const indicatorRepository = createIndicatorRepository({ rawIndicators, rawReports });
  await indicatorRepository.initialize();

  const indicatorService = new IndicatorService(indicatorRepository);
  const app = createApp({ indicatorService });
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "..", "dist", "public");

  app.use(
    express.static(staticPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          // Keep HTML fresh so deployments reflect immediately.
          res.setHeader("Cache-Control", "no-store");
        }
      },
    })
  );

  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(indexPath);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
