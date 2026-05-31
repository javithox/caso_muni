import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const listarReportes = async (req: Request, res: Response) => {
  try {
    const reportes = await prisma.reporte.findMany({
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
  } catch (error) {
    console.error('Error al listar reportes:', error);
    res.status(500).json({ message: 'Error al obtener los reportes' });
  }
};

export const crearReporte = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, latitud, longitud, severidad, imagen, usuarioId } = req.body;

    if (!titulo || !descripcion || latitud === undefined || longitud === undefined || !severidad || !usuarioId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para crear el reporte' });
    }

    const nuevoReporte = await prisma.reporte.create({
      data: {
        titulo,
        descripcion,
        latitud,
        longitud,
        severidad,
        imagen,
        usuarioId
      }
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ message: 'Error al crear el reporte' });
  }
};
