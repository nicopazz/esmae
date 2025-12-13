import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* 1. SIDEBAR (Barra Lateral) */}
      <aside className="w-64 bg-black text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Esmae Admin</h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-gray-900 rounded-md text-white"
          >
            📦 Productos
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 rounded-md transition-colors"
          >
            🛒 Pedidos
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 rounded-md transition-colors mt-10 border-t border-gray-800"
          >
            ⬅ Volver a la web
          </Link>
        </nav>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Cabecera Móvil (solo se ve en celular) */}
        <div className="md:hidden mb-6 flex justify-between items-center">
             <h1 className="text-xl font-bold">Esmae Admin</h1>
             <Link href="/" className="text-sm underline">Salir</Link>
        </div>

        {/* Aquí se renderizarán las páginas del admin */}
        {children}
      </main>
    </div>
  );
}