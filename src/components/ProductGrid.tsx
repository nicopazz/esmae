"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react"; // Importamos iconos nuevos

// Componente interno
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductGridContent({ products, title }: { products: any[], title?: string }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [searchTerm, setSearchTerm] = useState(""); // NUEVO: Estado para la búsqueda

  // 1. Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category.name);
    return ["Todo", ...Array.from(new Set(cats))];
  }, [products]);

  // 2. EFECTO: Detectar categoría desde URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(categoryFromUrl);
    } else {
       setActiveCategory("Todo"); 
    }
  }, [searchParams, categories]);

  // 3. FILTRADO DOBLE (Categoría + Texto)
  const filteredProducts = products.filter((p) => {
    // Filtro por Categoría
    const matchesCategory = activeCategory === "Todo" || p.category.name === activeCategory;
    
    // Filtro por Texto (Nombre o Categoría)
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
        p.name.toLowerCase().includes(term) || 
        p.category.name.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mt-15 space-y-8">
      
      {/* --- HEADER + CONTROLES --- */}
      <div className="flex flex-col gap-6 mb-8">
        
        {/* Título y Buscador */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="w-full md:w-auto">
              {title && (
                <>
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-1">
                    Shop Online
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
                    {title}
                  </h2>
                </>
              )}
            </div>

            {/* BARRA DE BÚSQUEDA (NUEVO) */}
            <div className="relative w-full md:w-72">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-black text-white border-black shadow-md" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRILLA DE RESULTADOS --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group flex flex-col">
            <Link href={`/producto/${product.id}`} className="relative w-full aspect-3/4 mb-4 overflow-hidden rounded-md bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 block cursor-pointer">
              {product.images[0] ? (
                <Image 
                  src={product.images[0].url} 
                  alt={product.name}
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin Imagen</div>
              )}
              
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                <div className="w-full bg-white/90 backdrop-blur-sm text-black py-2.5 md:py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm border border-white/20 text-center">
                  Ver Detalle
                </div>
              </div>
            </Link>

            <div className="space-y-1 text-center md:text-left px-1">
              <Link href={`/producto/${product.id}`}>
                <h3 className="font-serif text-base text-gray-900 leading-tight group-hover:text-gray-600 transition-colors line-clamp-2 cursor-pointer">
                    {product.name}
                </h3>
              </Link>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium truncate">
                    {product.category.name}
                </p>
                <span className="font-medium text-gray-900 text-sm">
                    ${Number(product.price).toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Estado Vacío */}
        {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Search className="mb-4 text-gray-300" size={32} />
                <p className="italic mb-2">No encontramos productos que coincidan con &quot;{searchTerm}&quot;</p>
                <button 
                    onClick={() => { setSearchTerm(""); setActiveCategory("Todo"); }} 
                    className="text-sm font-bold text-black underline underline-offset-4"
                >
                    Limpiar filtros
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

// Exportamos envuelto en Suspense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductGrid(props: { products: any[], title?: string }) {
  return (
    <Suspense fallback={<div className="py-20 text-center">Cargando catálogo...</div>}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}