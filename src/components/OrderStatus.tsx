"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrderStatus({ id, initialStatus }: { id: number, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Estado actualizado a: ${newStatus.toUpperCase()}`);
        router.refresh(); // Refresca los datos en pantalla
      } else {
        throw new Error();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("No se pudo actualizar");
      setStatus(initialStatus); // Volver al anterior si falla
    } finally {
      setLoading(false);
    }
  };

  // Colores según el estado
  const getColor = (s: string) => {
    if (s === "pendiente") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "contactado") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "pagado") return "bg-green-100 text-green-800 border-green-200";
    if (s === "enviado") return "bg-purple-100 text-purple-800 border-purple-200";
    if (s === "cancelado") return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="relative">
      {loading && <span className="absolute -top-2 right-0 text-[10px] text-gray-400">Guardando...</span>}
      
      <select 
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`appearance-none cursor-pointer text-xs font-bold uppercase py-1 px-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black ${getColor(status)}`}
      >
        <option value="pendiente">Pendiente</option>
        <option value="contactado">Contactado</option>
        <option value="pagado">Pagado</option>
        <option value="enviado">Enviado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>
  );
}