"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, ChevronDown } from "lucide-react";

export default function OrderStatus({ id, initialStatus }: { id: number, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      setStatus(newStatus);
      toast.success(`Estado cambiado a: ${newStatus.toUpperCase()}`);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (s: string) => {
    switch (s) {
      case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pagada": return "bg-green-100 text-green-800 border-green-200";
      case "entregada": return "bg-blue-100 text-blue-800 border-blue-200"; 
      case "cancelada": return "bg-red-100 text-red-800 border-red-200";     
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative group">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <Loader2 size={16} className="animate-spin text-black" />
        </div>
      )}
      
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        className={`appearance-none cursor-pointer w-32 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border outline-none text-center transition-colors ${getColor(status)}`}
      >
        <option value="pendiente">Pendiente</option>
        <option value="pagada">Pagada</option>
        <option value="entregada">Entregada</option>
        <option value="cancelada">Cancelada</option>
      </select>
      
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
    </div>
  );
}