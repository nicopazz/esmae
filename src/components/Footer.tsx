import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* GRID PRINCIPAL: 3 Columnas (Antes eran 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 md:mb-16 border-b border-gray-800 pb-12 text-center md:text-left">
          
          {/* Columna 1: Explorar */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Explorar</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/historia" className="hover:text-white transition-colors">Nuestra Historia</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo Completo</Link></li>
              <li><Link href="/mayorista" className="hover:text-white transition-colors">Venta Mayorista</Link></li>
            </ul>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Contacto</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>📍</span> San Miguel de Tucumán, Argentina
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>✉️</span> esmae.espejos@gmail.com
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>🕒</span> Atención las 24hs.
              </li>
            </ul>
          </div>

          {/* Columna 3: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Newsletter</h3>
            <p className="text-xs text-gray-400 mb-4 mx-auto md:mx-0 max-w-xs">
              Novedades y descuentos exclusivos.
            </p>
            <form className="flex flex-col gap-2 max-w-sm mx-auto md:mx-0">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-sm focus:outline-none focus:border-white transition-colors text-sm text-center md:text-left"
              />
              <button className="bg-white text-black px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
                Suscribirse
              </button>
            </form>
          </div>

        </div>

        {/* SUB-FOOTER: Copyright + TU FIRMA */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-6 md:gap-4">
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-center md:text-left items-center md:items-start">
            <p>© 2025 Esmae Design. Todos los derechos reservados.</p>
            
            {/* TU FIRMA */}
            <p>
              Diseñado por{" "}
              <a 
                href="https://nicopazz.github.io/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-white transition-colors font-bold underline decoration-gray-700 hover:decoration-white underline-offset-4"
              >
                Nico Paz
              </a>
            </p>
          </div>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Términos</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}