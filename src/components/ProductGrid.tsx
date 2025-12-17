"use client"; 

import { useState, useMemo, useEffect, Suspense } from "react"; // <--- Importamos Suspense y useEffect
import { useSearchParams } from "next/navigation"; // <--- Hook para leer la URL
import Image from "next/image"; 
import ProductModal from "./ProductModal";

// Creamos un componente interno para usar useSearchParams sin problemas de Hydration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductGridContent({ products, title }: { products: any[], title?: string }) {
  const searchParams = useSearchParams(); // Leemos los parámetros
  const [activeCategory, setActiveCategory] = useState("Todo");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // 1. Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category.name);
    return ["Todo", ...Array.from(new Set(cats))];
  }, [products]);

  // 2. EFECTO: Detectar cambio en la URL para activar el filtro
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(categoryFromUrl);
    } else {
       setActiveCategory("Todo"); 
    }
  }, [searchParams, categories]);

  // 3. Filtrar
  const filteredProducts = activeCategory === "Todo" 
    ? products 
    : products.filter((p) => p.category.name === activeCategory);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="mt-15 space-y-8">
      {/* HEADER + FILTROS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
        <div className="w-full md:w-auto">
          {title && (
            <>
               <span className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-1">
                 Shop Online
               </span>
               <h2 className="text-3xl md:text-4xl font-serif  text-gray-900 leading-tight">
                 {title}
               </h2>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
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

      {/* GRILLA */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group cursor-pointer flex flex-col"
            onClick={() => openModal(product)} 
          >
            <div className="relative w-full aspect-3/4 mb-4 overflow-hidden rounded-md bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
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
                <button className="w-full bg-white/90 backdrop-blur-sm text-black py-2.5 md:py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-sm border border-white/20">
                  Ver Detalle
                </button>
              </div>
            </div>
            <div className="space-y-1 text-center md:text-left px-1">
              <h3 className="font-serif text-base text-gray-900 leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                  {product.name}
              </h3>
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
        {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="italic mb-4">No hay productos en esta categoría por el momento.</p>
                <button onClick={() => setActiveCategory("Todo")} className="text-sm font-bold text-black underline underline-offset-4">Ver todos</button>
            </div>
        )}
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

// Exportamos el componente envuelto en Suspense para evitar errores de build en Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductGrid(props: { products: any[], title?: string }) {
  return (
    <Suspense fallback={<div className="py-20 text-center">Cargando catálogo...</div>}>
      <ProductGridContent {...props} />
    </Suspense>
  );
}