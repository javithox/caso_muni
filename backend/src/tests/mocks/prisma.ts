export const prismaMock = {
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },

  reporte: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};