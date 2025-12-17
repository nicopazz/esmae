"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 min-w-50">
          <span className="font-semibold text-sm text-center">
            ¿Quieres cerrar sesión?
          </span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                signOut();
              }}
              className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors"
            >
              Sí, salir
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        icon: "👋",
      }
    );
  };

  // Helper para verificar si es admin (evita errores de TS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  return (
    <>
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* 1. IZQUIERDA */}
          <div className="flex-1 flex justify-start items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-black transition-colors"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 tracking-wide">
              <Link href="/" className="hover:text-[#C6A892] transition-colors">
                Inicio
              </Link>
              <Link
                href="/#colecciones"
                className="hover:text-[#C6A892] transition-colors"
              >
                Colecciones
              </Link>
              <Link
                href="/#catalogo"
                className="hover:text-[#C6A892] transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/#footer"
                className="hover:text-[#C6A892] transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* 2. CENTRO: Logo */}
          <div className="flex-0 relative flex justify-center items-center">
            <Link 
              href="/" 
              className="relative w-56 h-16 md:w-96 md:h-18 block hover:opacity-80 transition-opacity"
            >
              <Image
                src="/esmaepng.png"
                alt="Esmae"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 224px, 384px"
              />
            </Link>
          </div>

          {/* 3. DERECHA */}
          <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
            {session ? (
              <div className="hidden md:flex items-center gap-3">
                {/* LÓGICA DE ADMIN (SOLO VISIBLE SI EL ROL ES ADMIN) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-2 rounded-full hover:text-[#C6A892] transition-colors"
                    title="Ir al Panel Admin"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:block text-gray-600 hover:text-[#C6A892] transition-colors"
                title="Iniciar Sesión"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}

            <Link href="/carrito" className="relative group p-1">
              <ShoppingBag
                size={22}
                strokeWidth={1.5}
                className="text-gray-600 group-hover:text-[#C6A892] transition-colors"
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse-once">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* --- MENÚ MÓVIL --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-75 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <span className="font-serif text-xl font-bold">Esmae.</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-lg font-medium text-gray-800"
            >
              Inicio <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link
              href="/#colecciones"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-lg font-medium text-gray-800"
            >
              Colecciones <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link
              href="/#catalogo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-lg font-medium text-gray-800"
            >
              Catálogo <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link
              href="/#footer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-lg font-medium text-gray-800"
            >
              Contacto <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <hr className="border-gray-100 my-2" />

            {session ? (
              <div className="space-y-4">
                {/* LÓGICA DE ADMIN MÓVIL (SOLO VISIBLE SI EL ROL ES ADMIN) */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-black bg-gray-100 p-3 rounded-md"
                  >
                    <LayoutDashboard size={18} />
                    Panel Admin
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-700 w-full"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-medium text-gray-600"
              >
                <User size={20} />
                Iniciar Sesión
              </Link>
            )}
          </nav>

          <div className="mt-auto pt-8 text-xs text-gray-400 text-center">
            &copy; 2025 Esmae Design
          </div>
        </div>
      </div>
    </>
  );
}