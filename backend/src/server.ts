import express from "express";
import cors from "cors";
import reporteRoutes from "./routes/reporte.routes"; // ajusta la ruta si cambia

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://caso-muni-omega.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// ← ESTA LÍNEA ES LA QUE FALTA
app.use("/api/reportes", reporteRoutes);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});