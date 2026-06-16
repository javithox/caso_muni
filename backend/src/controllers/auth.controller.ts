import { createHash } from "crypto";
import prisma from "../config/prisma";

type Request = { body: any };
type Response = { status: (code: number) => Response; json: (body: any) => Response };

// Validar campos requeridos
const validarRegistro = (body: any): { valido: boolean; error?: string } => {
  if (!body.nombre || typeof body.nombre !== "string" || body.nombre.trim() === "") {
    return { valido: false, error: "El campo 'nombre' es requerido y debe ser un texto" };
  }
  if (!body.email || typeof body.email !== "string" || body.email.trim() === "") {
    return { valido: false, error: "El campo 'email' es requerido y debe ser un texto" };
  }
  if (!body.password || typeof body.password !== "string" || body.password.trim() === "") {
    return { valido: false, error: "El campo 'password' es requerido y debe ser un texto" };
  }
  if (body.password.length < 6) {
    return { valido: false, error: "La contraseña debe tener al menos 6 caracteres" };
  }
  return { valido: true };
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos"
      });
    }

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
    // Validar campos requeridos
    const validacion = validarRegistro(req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        message: validacion.error
      });
    }

    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existe = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existe) {
      return res.status(400).json({
        message: "El email ya está registrado"
      });
    }

    // Encriptar contraseña
    const passwordHash = createHash("sha256").update(password).digest("hex");

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        password: passwordHash
      }
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      message: "Error registrando usuario",
      error: process.env.NODE_ENV === "development" ? error : undefined
    });
  }
};