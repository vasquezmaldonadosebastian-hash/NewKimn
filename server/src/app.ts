import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initializeIndicators } from "./services/indicatorService";
import { createApp } from "./createApp";
import indicadoresData from "../../data/indicadores.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApp();
  const server = createServer(app);

  // Handle both old { indicadores, reportesAgrupados } and new [ ... ] formats
  const rawIndicators = Array.isArray(indicadoresData) 
    ? indicadoresData 
    : (indicadoresData as any).indicadores || [];
  
  const rawReports = Array.isArray(indicadoresData) 
    ? [] 
    : (indicadoresData as any).reportesAgrupados || [];

  initializeIndicators(rawIndicators, rawReports);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    res.sendFile(indexPath);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
