"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("¡Cuenta creada con éxito! 🎉");
        router.push("/auth/login"); // Redirigir al login
      } else {
        toast.error(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-gray-900 font-serif text-2xl">Crear Cuenta</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">Únete a Esmae</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Tu nombre"
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
              placeholder="tu@email.com"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contraseña</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••"
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Confirmar</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••"
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">¿Ya tienes cuenta? </span>
            <Link href="/auth/login" className="font-bold text-black hover:underline">
                Inicia sesión aquí
            </Link>
        </div>
      </div>
    </div>
  );
}