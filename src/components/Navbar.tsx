"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // <--- Importamos el hook

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart(); // <--- Usamos el contexto para saber cuántos hay

  return (
    <nav className="bg-white sticky top-0 z-40 transition-all duration-300 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Menú Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          {/* Links Escritorio */}
          <div className="hidden md:flex space-x-12 text-sm font-medium text-gray-500 tracking-wide">
            <Link href="/colecciones" className="hover:text-black transition-colors">Colecciones</Link>
            <Link href="/catalogo" className="hover:text-black transition-colors">Catálogo</Link>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-3xl font-serif font-bold tracking-tight text-black">
              Esmae.
            </Link>
          </div>

          {/* DERECHA: Contacto + CARRITO DE PEDIDOS */}
          <div className="flex items-center gap-6">
            <Link href="/contacto" className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Contacto
            </Link>
            
            {/* Ícono de Bolsa de Pedido */}
            <Link href="/carrito" className="relative group p-2">
              <span className="sr-only">Ver Pedido</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-900 group-hover:text-gray-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              
              {/* Contador Rojo (Solo aparece si hay items) */}
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black rounded-full animate-bounce-slow">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* (El menú móvil sigue igual...) */}
      {isOpen && (
         <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 h-screen z-50 animate-in slide-in-from-left-5 duration-300">
          <div className="px-8 pt-10 space-y-8 flex flex-col">
            <Link href="/colecciones" className="text-2xl font-serif text-black" onClick={() => setIsOpen(false)}>Colecciones</Link>
            <Link href="/catalogo" className="text-2xl font-serif text-black" onClick={() => setIsOpen(false)}>Catálogo</Link>
            <Link href="/contacto" className="text-2xl font-serif text-black" onClick={() => setIsOpen(false)}>Contacto</Link>
          </div>
        </div>
      )}
    </nav>
  );
}