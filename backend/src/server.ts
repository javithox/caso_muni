import cors from 'cors';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const allowedOrigins = ['https://caso-muni-omega.vercel.app'];

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));