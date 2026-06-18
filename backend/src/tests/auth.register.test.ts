import { register } from "../controllers/auth.controller";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Register", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe rechazar contraseña corta", async () => {

    const req: any = {
      body: {
        nombre: "Javier",
        email: "javier@test.com",
        password: "123"
      }
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(400);
  });

  it("debe registrar usuario", async () => {

    (prisma.usuario.findUnique as jest.Mock)
      .mockResolvedValue(null);

    (prisma.usuario.create as jest.Mock)
      .mockResolvedValue({
        id: 1,
        nombre: "Javier",
        email: "javier@test.com"
      });

    const req: any = {
      body: {
        nombre: "Javier",
        email: "javier@test.com",
        password: "123456"
      }
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(201);
  });

});