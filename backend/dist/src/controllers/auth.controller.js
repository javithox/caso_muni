"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const existingUser = await prisma_1.default.usuario.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
    }
    catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }
        const user = await prisma_1.default.usuario.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token, user: { id: user.id, nombre: user.nombre, email: user.email } });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.login = login;
