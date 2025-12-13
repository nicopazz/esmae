import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Si no tiene permiso, mándalo aquí
  },
});

export const config = {
  // Aquí definimos qué rutas queremos proteger con candado
  // El asterisco * significa "todo lo que esté dentro de admin"
  matcher: ["/admin/:path*"],
};