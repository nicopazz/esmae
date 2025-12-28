import Image from "next/image";

export default function StorySection() {
  return (
    <section className="py-24 bg-[#121212] text-white relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-100 md:h-125 w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <Image 
              src="https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=800" 
              alt="Artesano trabajando madera" 
              fill
              className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="space-y-8">
            
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              La belleza de lo <br />
              <span className="italic text-[#C6A892]">artesanal.</span>
            </h2>

            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
              Cada pieza de Esmae pasa por manos expertas. Creemos en la decoración consciente, en los materiales nobles y en el diseño que perdura. 
              <br /><br />
              No son solo objetos, son partes de tu historia.
            </p>
            <div className="flex gap-16 pt-6 border-t border-gray-800 mt-8">
              <div>
                <span className="block text-4xl font-serif text-[#C6A892] mb-1">100%</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Materiales Locales</p>
              </div>
              <div>
                <span className="block text-4xl font-serif text-[#C6A892] mb-1">48hs</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Cotización a medida</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}