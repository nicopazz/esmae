import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text", placeholder: "admin" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // AQUÍ DEFINIMOS TU USUARIO Y CONTRASEÑA MAESTROS
        // Puedes cambiarlos por los que tú quieras
        const user = { id: "1", name: "Nicolas Admin", email: "admin@esmae.com" };
        
        const isValidUser = credentials?.username === "admin"; // Tu usuario
        const isValidPassword = credentials?.password === "esmae123"; // Tu contraseña

        if (isValidUser && isValidPassword) {
          return user;
        } else {
          return null; // Si falla, no dejamos entrar
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login", // Crearemos una página de login bonita después
  }
});

export { handler as GET, handler as POST };