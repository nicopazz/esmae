"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al éxito

export default function CheckoutPage() {
  
  const router = useRouter();
  
  const { items, removeItem, decreaseItem, addItem, totalPrice, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Manejo del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviamos los datos a nuestra API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items,
          total: totalPrice
        })
      });

      if (response.ok) {
        clearCart(); // Vaciamos el carrito
        alert("¡Pedido enviado con éxito! Nos pondremos en contacto contigo.");
        router.push("/"); // Volvemos al home (o podríamos crear una página de gracias)
      } else {
        alert("Hubo un error al enviar el pedido. Intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el carrito está vacío, mostramos mensaje
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-3xl font-serif text-gray-900 mb-4">Tu pedido está vacío</h2>
        <p className="text-gray-500 mb-8">Parece que no has agregado productos todavía.</p>
        <Link href="/" className="px-8 py-3 bg-black text-white uppercase text-xs font-bold tracking-widest hover:bg-gray-800">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLUMNA 1: FORMULARIO */}
        <div className="bg-white p-8 rounded-sm shadow-sm h-fit">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Datos de Contacto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nombre Completo</label>
              <input 
                required 
                name="name"
                type="text" 
                className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Ej: Juan Pérez"
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">WhatsApp / Teléfono</label>
                <input 
                  required 
                  name="phone"
                  type="tel" 
                  className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Ej: 381..."
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                <input 
                  required 
                  name="email"
                  type="email" 
                  className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="juan@email.com"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Mensaje o Aclaraciones (Opcional)</label>
              <textarea 
                name="message"
                rows={4} 
                className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Ej: ¿Hacen envíos al centro?..."
                onChange={handleInputChange}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Solicitar Presupuesto"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Al enviar, nos llegará tu pedido y te contactaremos para coordinar el pago y envío.
            </p>

          </form>
        </div>

 {/* COLUMNA 2: RESUMEN DEL PEDIDO */}
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Resumen del Pedido</h2>
          <div className="bg-white p-8 rounded-sm shadow-sm space-y-6">
            
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                
                {/* Imagen */}
                <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                
                {/* Info + Controles */}
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-gray-900">{item.name}</h3>
                  
                  {/* CONTROLES DE CANTIDAD */}
                  <div className="flex items-center mt-2 gap-3">
                    <button 
                      onClick={() => decreaseItem(item.id)}
                      className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => addItem(item)} // Reutilizamos addItem que ya tiene la lógica de stock
                      disabled={item.quantity >= item.stock}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        item.quantity >= item.stock 
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      +
                    </button>
                  </div>
                  
                  {item.quantity >= item.stock && (
                     <span className="text-[10px] text-red-500 font-medium">Max. stock disponible</span>
                  )}
                </div>

                {/* Precio y Borrar */}
                <div className="text-right">
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 underline mt-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            
            {/* ... Total ... */}

            {/* TOTAL */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-serif text-gray-900">Total Estimado</span>
                <span className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-xs text-right text-gray-400 mt-1">Precio final a confirmar por WhatsApp</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}