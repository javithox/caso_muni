import { Request, Response } from 'express';

export const listarReportes = async (req: Request, res: Response) => {
  res.json([]);
};

export const crearReporte = async (req: Request, res: Response) => {
  res.json({ message: 'Reporte creado' });
};
