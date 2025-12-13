import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-12">
          
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold">Esmae.</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Creamos refugios visuales. Diseño minimalista y funcional para la vida moderna.
            </p>
          </div>

          {/* Columna 2: Explorar */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Explorar</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/historia" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo Completo</Link></li>
              <li><Link href="/mayorista" className="hover:text-white transition-colors">Venta Mayorista</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Contacto</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span>📍</span> Buenos Aires, Argentina
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> hola@esmae.com.ar
              </li>
              <li className="flex items-center gap-2">
                <span>🕒</span> Atención Lun-Vie 9 a 18hs
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Newsletter</h3>
            <p className="text-xs text-gray-400 mb-4">Novedades y descuentos exclusivos.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-white transition-colors text-sm"
              />
              <button className="bg-white text-black px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
                Suscribirse
              </button>
            </form>
          </div>

        </div>

        {/* SUB-FOOTER (Copyright) */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
          <p>© 2025 Esmae Design. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-400">Privacidad</Link>
            <Link href="#" className="hover:text-gray-400">Términos</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}