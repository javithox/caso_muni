import { login } from "../controllers/auth.controller";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Login", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar 400 si faltan datos", async () => {

    const req: any = {
      body: {}
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("debe retornar 401 si el usuario no existe", async () => {

    (prisma.usuario.findUnique as jest.Mock)
      .mockResolvedValue(null);

    const req: any = {
      body: {
        email: "test@test.com",
        password: "123456"
      }
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

});