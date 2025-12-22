"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
};

export default function AddToCartBtn({ product }: Props) {
  const { addItem } = useCart();
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Si no hay stock
  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-100 text-gray-400 font-bold uppercase tracking-widest cursor-not-allowed rounded"
      >
        Agotado
      </button>
    );
  }

  const handleDecrease = () => {
    if (count > 1) setCount(count - 1);
  };

  const handleIncrease = () => {
    if (count < product.stock) {
      setCount(count + 1);
    } else {
      toast.error("Stock máximo alcanzado");
    }
  };

  const handleAddToCart = () => {
    addItem(product, count);
    setIsAdded(true);
    setCount(1); // Reseteamos el contador a 1 después de agregar
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex gap-4 h-14">
      {/* SELECTOR DE CANTIDAD */}
      <div className="flex items-center border border-gray-300 rounded w-32 shrink-0">
        <button 
          onClick={handleDecrease}
          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
          type="button"
        >
          <Minus size={16} />
        </button>
        
        <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-100">
          {count}
        </div>
        
        <button 
          onClick={handleIncrease}
          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* BOTÓN AGREGAR */}
      <button
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-300 rounded ${
          isAdded
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isAdded ? (
          <>
            <Check size={20} /> Agregado
          </>
        ) : (
          <>
            <ShoppingBag size={20} /> Agregar al Carrito
          </>
        )}
      </button>
    </div>
  );
}