import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import reporteRoutes from './routes/reporte.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz opcional para dar la bienvenida y confirmar funcionamiento
app.get('/', (req, res) => {
  res.send('¡El backend de Valle del Sol está funcionando correctamente! ☀️');
});

app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);

export default app;
