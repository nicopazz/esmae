import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Importamos la config centralizada

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };