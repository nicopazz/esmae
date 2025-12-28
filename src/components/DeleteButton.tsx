"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast, type Toast } from "react-hot-toast"; 

export default function DeleteButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const performDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Eliminando producto...");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.dismiss(toastId);
        toast.success("Producto eliminado");
        router.refresh(); 
      } else {
        toast.dismiss(toastId);
        toast.error("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
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
          <p className="font-bold text-white mt-1">¿Eliminar Producto?</p>
          <p className="text-xs text-gray-200">Esta acción es irreversible.</p>
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
      id: `delete-product-${id}`,
    });
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Eliminar"
    >
      {isDeleting ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}