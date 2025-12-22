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
  addItem: (product: any, count?: number) => void;
  removeItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Cargar desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("esmae_cart");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("esmae_cart", JSON.stringify(items));
  }, [items]);

  // Limpiar al cerrar sesión
  useEffect(() => {
    if (status === "unauthenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      localStorage.removeItem("esmae_cart");
    }
  }, [status]);

  // 1. AGREGAR (Ahora acepta cantidad)
  const addItem = (product: any, count: number = 1) => {
    // A. Validación de Sesión
    if (!session) {
      toast.error("Debes iniciar sesión para comprar 🔒", {
        style: { background: "#000", color: "#fff" },
      });
      router.push("/auth/login");
      return;
    }

    // B. Lógica de Producto
    const existingItem = items.find((item) => item.id === Number(product.id));
    const maxStock = product.stock || 99;

    if (existingItem) {
      // Validamos si la suma total superaría el stock
      if (existingItem.quantity + count > maxStock) {
        toast.error(`Solo quedan ${maxStock} unidades disponibles`);
        return;
      }

      toast.success(`Se agregaron ${count} unidades`);
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === Number(product.id)
            ? { ...item, quantity: item.quantity + count } // Sumamos la cantidad elegida
            : item
        )
      );
    } else {
      // Validamos si lo que quiere agregar supera el stock (caso raro pero posible)
      if (count > maxStock) {
         toast.error(`Solo quedan ${maxStock} unidades disponibles`);
         return;
      }

      toast.success("Producto agregado al carrito 🛒");
      setItems((currentItems) => [
        ...currentItems,
        {
          id: Number(product.id),
          name: product.name,
          price: Number(product.price),
          image: product.images?.[0]?.url || "",
          quantity: count, // Usamos la cantidad elegida
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