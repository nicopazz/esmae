"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

interface ModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ModalProps) {
  const [showSuccess, setShowSuccess] = useState(false); // Estado para el mensaje de "¡Agregado!"
  const { addItem, items } = useCart(); // Traemos 'items' para chequear stock actual en carrito

  // 1. Bloquear el scroll del cuerpo cuando se abre el modal
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  
// Verificamos si ya alcanzamos el stock máximo de este producto en el carrito
  const cartItem = items.find(item => item.id === product.id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = currentQtyInCart >= (product.stock || 0);

  const handleAddToOrder = () => {
    if (isOutOfStock) {
        toast.error("No hay suficiente stock 😓");
        return;
    }
    addItem(product);
    toast.success(`${product.name} agregado al pedido 🛒`);
    onClose(); 
  };

  // 3. Función para enviar a WhatsApp
  const handleConsultation = () => {
    const phoneNumber = "5493815555555"; // Tu número real
    const message = `Hola Esmae, tengo una duda sobre el producto: *${product.name}*`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    // Fondo oscuro (Backdrop) con animación fade-in
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Clic afuera para cerrar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Tarjeta del Modal con animación zoom-in */}
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-zoom-in">
        
        {/* Botón X Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-black transition-colors bg-white/50 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* COLUMNA IZQUIERDA: Imagen */}
        <div className="w-full md:w-1/2 bg-gray-100 h-64 md:h-auto relative">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0].url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
          )}
        </div>

        {/* COLUMNA DERECHA: Datos */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
          
          <h2 className="text-3xl font-serif text-gray-900 mb-2">{product.name}</h2>
          <p className="text-2xl font-light text-gray-500 mb-6">
            ${Number(product.price).toLocaleString()}
          </p>

          <div className="space-y-6">
            {/* Descripción */}
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Descripción</p>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Detalles Técnicos */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              {product.dimensions && (
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Medidas</p>
                  <p className="text-gray-900 font-medium">{product.dimensions}</p>
                </div>
              )}
              {product.material && (
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Material</p>
                  <p className="text-gray-900 font-medium">{product.material}</p>
                </div>
              )}
            </div>
          </div>

          {/* ZONA DE ACCIONES */}
          <div className="mt-8 space-y-3">
            
           {/* Botón Principal: AGREGAR AL PEDIDO */}
            <button 
              onClick={handleAddToOrder}
              disabled={showSuccess || isOutOfStock || product.stock === 0} // <--- Lógica de bloqueo
              className={`w-full py-4 px-6 uppercase tracking-wider text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isOutOfStock || product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Estilo deshabilitado
                  : showSuccess 
                    ? "bg-green-700 text-white" 
                    : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {product.stock === 0 ? (
                "Sin Stock"
              ) : isOutOfStock ? (
                "Stock Máximo Alcanzado"
              ) : showSuccess ? (
                <>
                  <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ¡Agregado al pedido!
                </>
              ) : (
                <>
                  <span>+</span> Agregar al Pedido
                </>
              )}
            </button>

            {/* Botón Secundario: Consultar solo este */}
            <button 
              onClick={handleConsultation}
              className="w-full bg-white border border-gray-200 text-gray-900 py-3 px-6 uppercase tracking-wider text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Consultar duda por WhatsApp
            </button>
            
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Agrega productos a tu lista para solicitar un presupuesto formal.
          </p>

        </div>
      </div>
    </div>
  );
}