"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
  // Disparamos la alerta de confirmación
  toast((t) => (
    <div className="flex flex-col gap-4 p-2 min-w-[300px]">
      <div className="text-center">
        <span className="text-2xl mb-2 block">⚠️</span>
        <h3 className="font-bold text-lg text-white">¿Borrar definitivamente?</h3>
        <p className="text-sm text-white mt-1">
          Se eliminará de la base de datos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        {/* Botón Cancelar */}
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancelar
        </button>

        {/* Botón Confirmar (Aquí va la lógica del fetch) */}
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors"
          onClick={async () => {
            toast.dismiss(t.id); // Cerramos la pregunta
            setIsDeleting(true); // Iniciamos estado de carga

            try {
              const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
              
              if (res.ok) {
                toast.success("Producto eliminado 🗑️");
                router.refresh();
              } else {
                toast.error("No se pudo eliminar");
                setIsDeleting(false); // Importante revertir si falla
              }
            } catch (error) {
              toast.error("Ocurrió un error");
              setIsDeleting(false);
            }
          }}
        >
          Sí, eliminar
        </button>
      </div>
    </div>
  ), {
    id: "delete-product-confirmation", // ID único para evitar múltiples popups
    duration: Infinity,
    position: "top-center"
  });
};

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 font-medium hover:underline disabled:text-gray-400"
    >
      {isDeleting ? "Borrando..." : "Borrar"}
    </button>
  );
}