import { crearReporte } from "../controllers/reporte.controller";

jest.mock("../lib/prisma", () => ({
  prisma: {
    reporte: {
      create: jest.fn(),
    },
  },
}));

import { prisma } from "../lib/prisma";

describe("Crear reporte", () => {

  it("debe crear reporte", async () => {

    (prisma.reporte.create as jest.Mock)
      .mockResolvedValue({
        id: 1,
        titulo: "Bache"
      });

    const req: any = {
      body: {
        titulo: "Bache",
        descripcion: "Grande",
        latitud: -33.4,
        longitud: -70.6
      }
    };

    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await crearReporte(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(201);
  });

});