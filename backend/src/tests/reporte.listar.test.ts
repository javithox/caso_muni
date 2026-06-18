import { listarReportes } from "../controllers/reporte.controller";

jest.mock("../lib/prisma", () => ({
  prisma: {
    reporte: {
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from "../lib/prisma";

describe("Listar reportes", () => {

  it("debe devolver reportes", async () => {

    (prisma.reporte.findMany as jest.Mock)
      .mockResolvedValue([
        {
          id: 1,
          titulo: "Basura"
        }
      ]);

    const req: any = {};

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await listarReportes(req, res);

    expect(res.json)
      .toHaveBeenCalled();
  });

});