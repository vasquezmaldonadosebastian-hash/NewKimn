import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initializeIndicators, getGroupedReports } from "./services/indicatorService";
import indicatorRoutes from "./api/v1/indicators/indicators.routes";
import indicadoresData from "../../data/indicadores.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  initializeIndicators(indicadoresData.indicadores, indicadoresData.reportesAgrupados);

  app.use("/api", indicatorRoutes);

  app.get("/api/reportes-agrupados", (_req, res) => {
    try {
      const reports = getGroupedReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch grouped reports' });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
