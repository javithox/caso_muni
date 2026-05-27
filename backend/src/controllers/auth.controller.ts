import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  res.json({ message: 'Login funcionando' });
};

export const register = async (req: Request, res: Response) => {
  res.json({ message: 'Registro funcionando' });
};
