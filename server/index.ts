import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { initializeIndicators, getGroupedReports } from "./services/indicatorService";
import indicatorRoutes from "./routes/indicators";
import indicadoresData from "../indicadores.json"; // Importar el JSON directamente

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Inicializar el servicio de indicadores con los datos del JSON
  // Asumiendo que indicadoresData.reportesAgrupados contiene los reportes agrupados
  initializeIndicators(indicadoresData.indicadores, indicadoresData.reportesAgrupados);

  // Montar las rutas de la API
  app.use("/api", indicatorRoutes);

  // Nueva ruta para reportes agrupados
  app.get("/api/reportes-agrupados", (_req, res) => {
    try {
      const reports = getGroupedReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch grouped reports' });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
