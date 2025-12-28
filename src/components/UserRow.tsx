"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Trash2, Shield, User as UserIcon, ChevronDown, Pencil } from "lucide-react";
import EditUserModal from "./EditUserModal"; 

type UserProps = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
};

export default function UserRow({ user }: UserProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); 

  
  const handleRoleChange = async (newRole: string) => {
    if (newRole === user.role) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("Rol actualizado");
        router.refresh();
      } else toast.error("Error al cambiar rol");
    } catch { toast.error("Error de conexión"); }
    finally { setLoading(false); }
  };

  
  const handleDeleteClick = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1 min-w-62.5">
        <div className="text-center">
            <span className="text-xl">⚠️</span>
            <p className="font-bold text-white mt-1">¿Eliminar Usuario?</p>
            <p className="text-xs text-white">Esta acción es irreversible.</p>
        </div>
        <div className="flex gap-2 justify-center mt-2">
            <button 
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 bg-gray-50 text-black text-xs font-bold rounded hover:bg-gray-200"
            >
                Cancelar
            </button>
            <button 
                onClick={() => {
                    toast.dismiss(t.id);
                    performDelete();
                }}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 shadow-sm"
            >
                Confirmar
            </button>
        </div>
      </div>
    ), { duration: 5000, id: `delete-${user.id}` });
  };

  const performDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuario eliminado");
        router.refresh();
      } else toast.error("Error al eliminar");
    } catch { toast.error("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${
              user.role === "ADMIN" ? "bg-black" : "bg-gray-300"
            }`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="relative inline-block w-40">
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={loading}
              className={`
                w-full appearance-none pl-9 pr-8 py-2 text-xs font-bold uppercase tracking-wider rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                ${user.role === "ADMIN" 
                  ? "bg-black text-white border-black focus:ring-gray-400" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 focus:ring-gray-200"}
              `}
            >
              <option value="USER">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
               user.role === "ADMIN" ? "text-white" : "text-gray-400"
            }`}>
               {user.role === "ADMIN" ? <Shield size={14} /> : <UserIcon size={14} />}
            </div>
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
               user.role === "ADMIN" ? "text-white" : "text-gray-400"
            }`}>
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">

            <button
                onClick={() => setIsEditOpen(true)}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                title="Editar Usuario"
            >
                <Pencil size={18} />
            </button>

            <button
              onClick={handleDeleteClick}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
              title="Eliminar Usuario"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      <EditUserModal 
        user={user} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => router.refresh()} 
      />
    </>
  );
}