const express = require('express');
const cors = require('cors');
const app = express();

// Lista de dominios permitidos
const allowedOrigins = [
  'https://caso-muni-omega.vercel.app', // Tu frontend en Vercel
  'http://localhost:3000'               // Tu entorno de desarrollo local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman o apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas de CORS'));
    }
  },
  credentials: true // Actívalo si usas cookies, sesiones o tokens de autenticación
}));
