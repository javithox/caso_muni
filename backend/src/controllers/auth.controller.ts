import { createHash } from "crypto";
import prisma from "../config/prisma";

type Request = { body: any };
type Response = { status: (code: number) => Response; json: (body: any) => Response };




export const login = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos"
      });
    }

    const passwordHash = createHash("sha256")
      .update(password)
      .digest("hex");

    if (usuario.password !== passwordHash) {
      return res.status(401).json({
        message: "Correo o contraseña incorrectos"
      });
    }

    return res.status(200).json({
      message: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error al iniciar sesión"
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existe) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    const passwordHash = createHash("sha256").update(password).digest("hex");

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash
      }
    });

    res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registrando usuario"
    });
  }
  
};