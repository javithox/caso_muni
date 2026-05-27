import { Router } from 'express';
import { listarReportes, crearReporte } from '../controllers/reporte.controller';

const router = Router();

router.get('/', listarReportes);
router.post('/', crearReporte);

export default router;
