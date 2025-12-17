"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // 1. Extraemos 'status' también para saber cuándo terminó de cargar la sesión
  const { data: session, status } = useSession(); 
  
  const router = useRouter();

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("esmae_cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage cada vez que cambia 'items'
  useEffect(() => {
    localStorage.setItem("esmae_cart", JSON.stringify(items));
  }, [items]);

  // --- 4. NUEVO: LIMPIAR AL CERRAR SESIÓN ---
  useEffect(() => {
    // Si el estado confirma que NO está autenticado (se deslogueó)
    if (status === "unauthenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]); // Vaciamos el estado
      localStorage.removeItem("esmae_cart"); // Borramos la memoria
    }
  }, [status]); // Se ejecuta cuando cambia el status de la sesión

  
  // Lógica de AGREGAR
  const addItem = (product: any) => {
    if (!session) {
      toast.error("Debes iniciar sesión para comprar 🔒", {
        style: { background: "#000", color: "#fff" },
      });
      router.push("/auth/login");
      return;
    }

    const existingItem = items.find((item) => item.id === Number(product.id));
    const maxStock = product.stock || 99;

    if (existingItem) {
      if (existingItem.quantity >= maxStock) {
        toast.error("Stock máximo alcanzado");
        return;
      }
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === Number(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setItems((currentItems) => [
        ...currentItems,
        {
          id: Number(product.id),
          name: product.name,
          price: Number(product.price),
          image: product.images?.[0]?.url || "",
          quantity: 1,
          stock: maxStock,
        },
      ]);
    }
  };

  const decreaseItem = (id: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === id);
      if (existingItem?.quantity === 1) {
        return currentItems.filter((item) => item.id !== id);
      }
      return currentItems.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const removeItem = (id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== Number(id)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, decreaseItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}