/* eslint-disable @next/next/no-img-element */
export default function StorySection() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* 1. IMAGEN (Se ve primero en móvil y escritorio) */}
          <div className="relative h-100 md:h-125 rounded-sm overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=800" 
              alt="Artesano trabajando madera" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* 2. TEXTO */}
          <div className="space-y-6 md:pl-10">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              Nuestra Filosofía
            </span>
            
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
              La belleza de lo <br />
              <span className="italic text-gray-600">artesanal.</span>
            </h2>

            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Cada pieza de Esmae pasa por manos expertas. Creemos en la decoración consciente, en los materiales nobles y en el diseño que perdura. 
              <br /><br />
              No son solo objetos, son partes de tu historia.
            </p>

            {/* Iconos de confianza (Grid de 2x2 en móvil) */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 mt-6">
              <div>
                <h4 className="font-bold text-gray-900">100%</h4>
                <p className="text-sm text-gray-500">Materiales Locales</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">48hs</h4>
                <p className="text-sm text-gray-500">Cotización a medida</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}