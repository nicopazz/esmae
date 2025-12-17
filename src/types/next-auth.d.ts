// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // 1. Extendemos la Sesión para que tenga ID y ROL
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  // 2. Extendemos el Usuario de la base de datos
  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  // 3. Extendemos el Token JWT
  interface JWT {
    id: string;
    role: string;
  }
}