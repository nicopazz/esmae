import Link from "next/link";
import Image from "next/image"; 

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-6 py-2 md:px-8 md: max-w-7xl mx-auto min-h-[85vh] ">
      <div className="order-2 md:order-1 space-y-6 md:space-y-8 flex flex-col items-center md:items-start text-center md:text-left">

        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase border border-gray-300 rounded-sm text-gray-500">
          Temporada 2026
        </span>

        <h1 className="text-4xl md:text-7xl font-serif font-medium text-gray-900 leading-tight">
          Detalles que <br className="hidden md:block" />
          <span className="italic text-[#C6A892]">inspiran calma.</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed">
          Nuestra selección de espejos, bazar y objetos están diseñados para crear ambientes con personalidad y armonía.
        </p>
        <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start w-full relative z-10">
          
          <Link 
            href="#catalogo" 
            className="px-8 py-3 md:py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl"
          >
            Ver Catálogo
          </Link>

          <Link 
            href="#colecciones" 
            className="px-8 py-3 md:py-4 bg-transparent border border-gray-200 text-gray-900 font-medium rounded-full hover:border-gray-900 transition-all flex items-center gap-2 group"
          >
            Explorar 
            <span className="hidden md:inline transition-transform group-hover:translate-x-1">Colecciones →</span> 
            <span className="md:hidden">→</span>
          </Link>
        </div>
      </div>

      <div className="relative order-1 md:order-2 w-full flex justify-center md:justify-end">
        
        <div className="relative h-70 md:h-150 w-full max-w-lg rounded-t-[10rem] rounded-b-4xl md:rounded-b-[10rem] overflow-hidden shadow-2xl bg-gray-100">
             <Image 
               src="/heroimg.jpg" 
               alt="Espejo Esmae Ambiente" 
               fill
               className="object-cover"
               priority 
             />
        </div>

        <div className="hidden md:flex absolute top-20 left-0 lg:-left-8 bg-white p-4 rounded-xl shadow-xl items-center gap-4 max-w-xs animate-bounce-slow border border-gray-100 z-20">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-800 text-lg">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Calidad Premium</p>
            <p className="text-[10px] text-gray-500">Hecho a mano en Argentina</p>
          </div>
        </div>

      </div>
    </section>
  );
}