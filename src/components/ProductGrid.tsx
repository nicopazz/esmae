/* eslint-disable @next/next/no-img-element */
"use client"; // Componente de Cliente

import { useState } from "react";
import ProductModal from "./ProductModal";

// Recibimos los productos como "prop" desde el servidor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductGrid({ products }: { products: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Pequeña espera para la animación
  };

  return (
    <>
      {/* 1. LA GRILLA DE PRODUCTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group cursor-pointer"
            onClick={() => openModal(product)} // <--- AL HACER CLICK, ABRIMOS MODAL
          >
            {/* Imagen */}
            <div className="relative w-full aspect-3/4 mb-4 overflow-hidden rounded-2xl bg-gray-50">
              {product.images[0] ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              
              {/* Botón flotante "Ver Detalle" */}
              <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <button className="w-full bg-white text-black py-3 text-xs font-bold tracking-widest uppercase shadow-lg hover:bg-black hover:text-white transition-colors">
                  Ver Detalle
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <span className="font-semibold text-gray-900">${Number(product.price).toLocaleString("es-AR")}</span>
              </div>
              <p className="text-sm text-gray-500 capitalize">{product.category.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. EL MODAL (Invisible hasta que isModalOpen sea true) */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}