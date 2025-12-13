/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8 py-16 md:py-24 max-w-7xl mx-auto">
      {/* COLUMNA IZQUIERDA: Textos */}
      <div className="space-y-8">
        {/* Etiqueta Temporada */}
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase border border-gray-300 rounded-sm text-gray-500">
          Temporada 2025
        </span>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-gray-900 leading-tight">
          Detalles que <br />
          <span className="italic text-gray-800">inspiran calma.</span>
        </h1>

        {/* Descripción */}
        <p className="text-lg text-gray-600 max-w-md leading-relaxed">
          Nuestra selección de espejos, bazar y objetos están diseñados para crear ambientes con personalidad y armonía.
        </p>

        {/* Botones */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Link 
            href="/catalogo" 
            className="px-8 py-4 bg-gray-900 text-white font-medium rounded-sm hover:bg-black transition-all"
          >
            Ver Catálogo
          </Link>
          <Link 
            href="/colecciones" 
            className="px-8 py-4 bg-transparent border border-gray-200 text-gray-900 font-medium rounded-sm hover:border-gray-900 transition-all flex items-center gap-2"
          >
            Explorar Colecciones <span>→</span>
          </Link>
        </div>
      </div>

      {/* COLUMNA DERECHA: Imagen Hero */}
      <div className="relative">
        {/* Imagen Principal */}
        <div className="relative h-150 w-full rounded-t-[10rem] rounded-b-4xl overflow-hidden shadow-xl bg-gray-100">
             {/* Usamos una imagen de ejemplo de Unsplash que encaja con el estilo */}
             <img 
               src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" 
               alt="Espejo Esmae" 
               className="w-full h-full object-cover"
             />
        </div>

        {/* Tarjeta Flotante "Calidad Premium" */}
        <div className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs animate-bounce-slow md:flex">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-800">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Calidad Premium</p>
            <p className="text-xs text-gray-500">Hecho a mano en Argentina</p>
          </div>
        </div>
      </div>
    </section>
  );
}