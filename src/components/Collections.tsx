import Link from "next/link";
import Image from "next/image"; // Usamos Image para optimizar

const collections = [
  {
    id: 1,
    name: "Espejos",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
    description: "Amplitud y diseño para tus paredes."
  },
  {
    id: 2,
    name: "Bazar",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600",
    description: "Objetos cotidianos con encanto."
  },
  {
    id: 3,
    name: "Deco",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
    description: "Texturas y aromas que envuelven."
  }
];

export default function Collections() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Título */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
            Explora por categoría
          </span>
          <h2 className="text-4xl font-serif text-gray-900">
            Nuestras Colecciones
          </h2>
        </div>

        {/* Grid de Colecciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item) => (
            <Link 
              // TRUCO: Enviamos el nombre por URL y hacemos scroll al id="catalogo"
              href={`/?category=${item.name}#catalogo`} 
              key={item.id}
              className="group cursor-pointer block"
            >
              {/* Imagen */}
              <div className="relative overflow-hidden rounded-lg aspect-4/5 mb-6 bg-gray-100 shadow-sm">
                <Image 
                  src={item.image} 
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Textos */}
              <div className="text-center">
                <h3 className="text-2xl font-serif text-gray-900 mb-2 group-hover:underline decoration-1 underline-offset-4 decoration-gray-400">
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