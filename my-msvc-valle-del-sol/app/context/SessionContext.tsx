"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface Usuario {
  id?: number;
  email: string;
  nombre?: string;
  nombreCompleto?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  rol?: string;
  activo?: boolean;
  fechaCreacion?: string;
  ultimoIngreso?: string;
  verificado?: boolean;
}

export interface SessionContextType {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
  actualizarUsuario: (usuario: Usuario) => void;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión del localStorage al montar el componente
  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      const tokenGuardado = localStorage.getItem("token");

      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      }
      if (tokenGuardado) {
        setToken(tokenGuardado);
      }
    } catch (error) {
      console.error("Error cargando sesión:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usuarioData: Usuario, tokenData: string) => {
    setUsuario(usuarioData);
    setToken(tokenData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  const actualizarUsuario = (usuarioData: Usuario) => {
    setUsuario(usuarioData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  return (
    <SessionContext.Provider
      value={{
        usuario,
        token,
        isLoading,
        login,
        logout,
        actualizarUsuario,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
