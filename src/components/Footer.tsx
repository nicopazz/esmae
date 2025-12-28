import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 pt-8 pb-6 md:pt-16 md:pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12 border-b border-gray-100 pb-8 md:pb-12 text-center md:text-left">
          <div className="hidden md:flex flex-col items-center md:items-start justify-start"> 
            <Link 
              href="/" 
              className="relative w-full max-w-md h-35 block hover:opacity-80 transition-opacity "
            >
               <Image
                src="/esmaepng.png" 
                alt="Esmae Logo"
                fill
                className="object-contain object-top-left"
                sizes="400px"
                priority 
              />
            </Link>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-6 text-gray-400">Contacto</h3>
            <ul className="space-y-2 md:space-y-4 text-sm text-gray-600">
              <li className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="text-lg group-hover:scale-110 transition-transform">📍</span> 
                <span>San Miguel de Tucumán, AR</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="text-lg group-hover:scale-110 transition-transform">✉️</span> 
                <a href="mailto:esmae.espejos@gmail.com" className="hover:text-black transition-colors">esmae.espejos@gmail.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 group">
                <span className="text-lg group-hover:scale-110 transition-transform">🕒</span> 
                <span>Atención Online 24hs.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-6 text-gray-400">Síguenos</h3>
            <div className="flex justify-center md:justify-start gap-4 mb-6 md:mb-8">
              <a href="https://www.instagram.com/esmae_espejo" target="_blank" rel="noreferrer" aria-label="Instagram" className="group">
                <div className="p-2 md:p-3 bg-gray-50 rounded-full text-gray-600 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
              </a>
              <a href="https://wa.me/5493813921321" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="group">
                <div className="p-2 md:p-3 bg-gray-50 rounded-full text-gray-600 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </div>
              </a>
              <a href="https://www.tiktok.com/@florencia.salas75" target="_blank" rel="noreferrer" aria-label="TikTok" className="group">
                <div className="p-2 md:p-3 bg-gray-50 rounded-full text-gray-600 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm border border-transparent hover:border-gray-200">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg>
                </div>
              </a>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 text-gray-400">Medios de Pago</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
               <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 cursor-default">EFECTIVO</span>
               <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-500 cursor-default">TRANSFERENCIA</span>
            </div>
          </div>

        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 border-t border-gray-50 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row gap-1 md:gap-6 text-center md:text-left items-center md:items-start">
            <p>© 2025 Esmae Design. Todos los derechos reservados.</p>
            <p>
              Diseñado por{" "}
              <a href="https://nicopazz.github.io/" target="_blank" rel="noopener noreferrer" className="text-gray-900 font-bold underline decoration-gray-300 hover:decoration-black underline-offset-4">
                Nico Paz
              </a>
            </p>
          </div>

          <div className="flex gap-4 md:gap-6 font-medium">
            <Link href="#" className="hover:text-black transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-black transition-colors">Términos</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}