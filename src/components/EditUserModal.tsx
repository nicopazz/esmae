"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { X, Save, Lock, Mail, User } from "lucide-react";

type Props = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: "", // Vacío por defecto (si no escribe nada, no se cambia)
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtramos para enviar solo lo que tenga datos
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: any = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;

      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("Usuario actualizado correctamente");
        onSuccess();
        onClose();
      } else {
        toast.error("Error al actualizar");
      }
    } catch (error) {
        console.error(error);
        toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Overlay Oscuro */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-serif font-bold mb-1">Editar Usuario</h2>
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">ID: #{user.id}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <User size={12} /> Nombre
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Lock size={12} /> Nueva Contraseña (Opcional)
            </label>
            <input
              type="text" // Tipo text para que puedas ver lo que escribes al editar
              placeholder="Dejar vacío para no cambiar"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 p-2.5 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-blue-300/70"
            />
            <p className="text-[10px] text-gray-400">Si escribes aquí, la contraseña se cambiará.</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? "Guardando..." : <><Save size={16} /> Guardar Cambios</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}