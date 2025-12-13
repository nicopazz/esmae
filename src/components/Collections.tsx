/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const collections = [
  {
    id: 1,
    name: "Espejos",
    slug: "espejos",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
    description: "Amplitud y diseño para tus paredes."
  },
  {
    id: 2,
    name: "Bazar",
    slug: "bazar",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600", // Tablas de madera/ceramica
    description: "Objetos cotidianos con encanto."
  },
  {
    id: 3,
    name: "Deco",
    slug: "deco", // Ojo: asegúrate de haber creado esta categoría en la DB si quieres que el link funcione luego
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600", // Textiles/Sillón
    description: "Texturas y aromas que envuelven."
  }
];

export default function Collections() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Título de la Sección */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            Explora por categoría
          </span>
          <h2 className="text-4xl font-serif text-gray-900">
            Nuestras Colecciones
          </h2>
        </div>

        {/* Grid de 3 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item) => (
            <Link 
              href={`/categoria/${item.slug}`} 
              key={item.id}
              className="group cursor-pointer"
            >
              {/* Contenedor de Imagen con Efecto Zoom */}
              <div className="relative overflow-hidden rounded-lg aspect-4/5 mb-6 bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Capa oscura suave al pasar el mouse */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Textos */}
              <div className="text-center">
                <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:underline decoration-1 underline-offset-4">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 font-light">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}