import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listarReportes = async (
  req: Request,
  res: Response
) => {
  try {
    const reportes =
      await prisma.reporte.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(reportes);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const crearReporte = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      titulo,
      descripcion,
      latitud,
      longitud,
      severidad,
    } = req.body;

    const reporte =
      await prisma.reporte.create({
        data: {
          titulo,
          descripcion,
          latitud: Number(latitud),
          longitud: Number(longitud),
          estado: "pendiente",
          severidad,
        },
      });

    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json(error);
  }
};