import { Router } from 'express';
import { listarReportes, crearReporte } from '../controllers/reporte.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', listarReportes);
router.post('/', authenticateToken, crearReporte);

export default router;
