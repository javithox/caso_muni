"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reporte_controller_1 = require("../controllers/reporte.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', reporte_controller_1.listarReportes);
router.post('/', auth_middleware_1.authenticateToken, reporte_controller_1.crearReporte);
exports.default = router;
