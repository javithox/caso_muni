"use client";

import { useContext } from "react";
import { SessionContext, SessionContextType } from "../context/SessionContext";

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession debe ser usado dentro de un SessionProvider");
  }
  return context;
}
