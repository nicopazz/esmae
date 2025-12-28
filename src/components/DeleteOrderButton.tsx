"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast, type Toast } from "react-hot-toast"; 
import { deleteOrder } from "@/lib/actions";

export default function DeleteOrderButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const performDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Eliminando pedido...");

    try {
      const result = await deleteOrder(id);
      toast.dismiss(toastId);

      if (result.success) {
        toast.success("Pedido eliminado");
      } else {
        toast.error("Error al eliminar");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error de conexión");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    toast((t: Toast) => (
      <div className="flex flex-col gap-3 p-1 min-w-50">
        <div className="text-center">
          <span className="text-xl">⚠️</span>
          <p className="font-bold text-white mt-1">¿Borrar del historial?</p>
          <p className="text-xs text-white">Se perderán los datos del pedido.</p>
        </div>
        
        <div className="flex gap-2 justify-center mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-100 text-black text-xs font-bold rounded hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete();
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 shadow-sm transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    ), { 
      duration: 5000, 
      id: `delete-order-${id}`,
    });
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className="p-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm disabled:opacity-50"
      title="Eliminar del historial"
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}