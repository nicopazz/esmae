"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react"; // <--- 1. Importar hook de sesión
import { ShoppingBag, User, LayoutDashboard } from "lucide-react"; // <--- 2. Importar iconos

export default function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession(); // <--- 3. Obtener datos de sesión

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
          Esmae.
        </Link>

        {/* MENÚ CENTRO (Opcional, depende de tu diseño) */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">Catálogo</Link>
          <Link href="/#contacto" className="hover:text-black transition-colors">Contacto</Link>
        </div>

        {/* ÍCONOS DERECHA */}
        <div className="flex items-center gap-6">
          
          {/* BOTÓN DE LOGIN / ADMIN */}
          {session ? (
            // CASO 1: Si está logueado, mostramos acceso al ADMIN
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-2 rounded-sm hover:bg-gray-800 transition-colors"
              title="Ir al Panel de Administración"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          ) : (
            // CASO 2: Si NO está logueado, mostramos ícono de usuario para ir al LOGIN
            <Link 
              href="/auth/login" 
              className="text-gray-600 hover:text-black transition-colors"
              title="Iniciar Sesión"
            >
              <User size={22} strokeWidth={1.5} />
            </Link>
          )}

          {/* CARRITO (Ya lo tenías) */}
          <Link href="/carrito" className="relative group">
            <ShoppingBag size={22} strokeWidth={1.5} className="text-gray-600 group-hover:text-black transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}