"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Confirmación simple
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh(); // Recarga la tabla sin recargar la página entera
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsDeleting(false);
    }
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