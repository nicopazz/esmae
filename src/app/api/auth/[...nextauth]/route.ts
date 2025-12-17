import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar que lleguen datos
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        // 2. Buscar usuario en la DB (usamos 'username' para el email)
        const user = await prisma.user.findUnique({
          where: { email: credentials.username }
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // 3. Comparar contraseña encriptada
        const isValidPassword = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Contraseña incorrecta");
        }

        // 4. Retornar usuario (sin password)
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // Asegúrate de agregar el rol al token después si quieres proteger rutas
        };
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // Esto es vital para guardar el rol en la sesión
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role; 
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };