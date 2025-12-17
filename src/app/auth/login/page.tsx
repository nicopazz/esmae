"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link"; // <--- Importamos Link

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usamos NextAuth para iniciar sesión
      const res = await signIn("credentials", {
        username: form.email, // En nuestro provider configuramos 'username' para recibir el email
        password: form.password,
        redirect: false, // Importante: manejamos la redirección manualmente
      });

      if (res?.error) {
        toast.error("Credenciales incorrectas");
      } else {
        toast.success("¡Bienvenido/a de nuevo! 👋");
        router.push("/"); // Redirigir al inicio o donde prefieras
        router.refresh(); // Actualizar sesión en el cliente
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 font-serif text-2xl">Iniciar Sesión</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">Bienvenido a Esmae</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Email
            </label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="tu@email.com"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="••••••"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>
        </form>

        {/* --- AQUÍ AGREGAMOS EL LINK AL REGISTRO --- */}
        <div className="mt-6 text-center text-sm border-t border-gray-100 pt-6">
            <span className="text-gray-500">¿No tienes cuenta? </span>
            <Link href="/auth/register" className="font-bold text-black hover:underline ml-1">
                Regístrate aquí
            </Link>
        </div>

      </div>
    </div>
  );
}