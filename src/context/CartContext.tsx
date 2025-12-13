"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number; // <--- Nuevo: Guardamos el stock máximo real
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void; // Borrar todo el item
  decreaseItem: (id: number) => void; // Restar 1 unidad
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("esmae_cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("esmae_cart", JSON.stringify(items));
  }, [items]);

  // 1. AGREGAR (Con lógica de Stock)
  const addItem = (product: any) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === Number(product.id));
      const maxStock = product.stock || 99; // Si no hay dato de stock, asumimos 99

      if (existingItem) {
        // LÓGICA: Si ya llegamos al stock máximo, no sumamos más
        if (existingItem.quantity >= maxStock) {
          return currentItems; // No hacemos cambios
        }

        return currentItems.map((item) =>
          item.id === Number(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Si es nuevo
      return [...currentItems, {
        id: Number(product.id), // Forzamos que sea número
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0]?.url || "",
        quantity: 1,
        stock: maxStock 
      }];
    });
  };

  // 2. RESTAR UNA UNIDAD
  const decreaseItem = (id: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === id);
      
      // Si solo queda 1, lo borramos del todo
      if (existingItem?.quantity === 1) {
        return currentItems.filter((item) => item.id !== id);
      }

      // Si hay más de 1, restamos
      return currentItems.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // 3. ELIMINAR EL PRODUCTO COMPLETO (Corrigiendo el bug de "borra todo")
  const removeItem = (id: number) => {
    // Usamos Number(id) para asegurar que comparamos numero con numero
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