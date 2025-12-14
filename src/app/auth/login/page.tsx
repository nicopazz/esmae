"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
   

    // Intentamos iniciar sesión con las credenciales
    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false, // No redirigir automático, lo manejamos nosotros
    });

    if (res?.error) {
      toast.error("Usuario o contraseña incorrectos ❌");
      setLoading(false);
    } else {
      toast.success("¡Bienvenido de nuevo! 👋");
      // Si todo sale bien, vamos al admin
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-100">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Esmae.</h1>
          <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase text-xs font-bold">
            Acceso Administrativo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-black transition-colors">
                ← Volver a la tienda
            </Link>
        </div>

      </div>
    </div>
  );
}