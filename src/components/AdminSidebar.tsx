"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Package, ShoppingCart, ArrowLeft, Users } from "lucide-react"; 


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  // Definimos tus enlaces aquí para mantener el código limpio
  const links = [ 
    { name: "Dasboard", href: "/admin", icon: Package, exact: false },
    { name: "Productos", href: "/admin/products", icon: Package, exact: false },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart, exact: false },
    { name: "Usuarios", href: "/admin/users", icon: Users, exact: false },
  ];

  return (
    <>
      {/* 1. FONDO OSCURO (Overlay) - Solo visible en móvil cuando el menú está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 2. BARRA LATERAL (ASIDE) */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-black text-white shrink-0 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex justify-between items-center h-20">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Esmae Admin</h2>
          {/* Botón X para cerrar en móvil */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-2 px-4 space-y-2">
          {links.map((link) => {
             // Lógica para saber si el link está activo (para pintarlo de gris claro)
             const isActive = link.exact 
                ? pathname === link.href 
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose} // Cierra el menú al hacer click (útil en móvil)
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            );
          })}

          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 rounded-md transition-colors mt-10 border-t border-gray-800"
          >
            <ArrowLeft size={20} />
            Volver a la web
          </Link>
        </nav>
      </aside>
    </>
  );
}