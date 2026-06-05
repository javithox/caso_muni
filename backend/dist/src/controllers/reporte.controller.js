"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearReporte = exports.listarReportes = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const listarReportes = async (req, res) => {
    try {
        const reportes = await prisma_1.default.reporte.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(reportes);
    }
    catch (error) {
        console.error('Error al listar reportes:', error);
        res.status(500).json({ message: 'Error al obtener los reportes' });
    }
};
exports.listarReportes = listarReportes;
const crearReporte = async (req, res) => {
    try {
        const { titulo, descripcion, latitud, longitud, severidad, imagen, usuarioId } = req.body;
        if (!titulo || !descripcion || latitud === undefined || longitud === undefined || !severidad || !usuarioId) {
            return res.status(400).json({ message: 'Faltan campos obligatorios para crear el reporte' });
        }
        const nuevoReporte = await prisma_1.default.reporte.create({
            data: {
                titulo,
                descripcion,
                latitud,
                longitud
            }
        });
        res.status(201).json(nuevoReporte);
    }
    catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ message: 'Error al crear el reporte' });
    }
};
exports.crearReporte = crearReporte;
