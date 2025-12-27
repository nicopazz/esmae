import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// 1. Importamos el icono de MessageCircle (o Phone si prefieres)
import { ArrowLeft, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import AddToCartBtn from "@/components/AddToCartBtn";

// Tipado para Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  // 1. Buscamos el producto
  const productRaw = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true, category: true },
  });

  if (!productRaw) return notFound();

  // 2. Convertimos el Decimal a Number
  const product = {
    ...productRaw,
    price: productRaw.price.toNumber(),
  };

  // --- CONFIGURACIÓN WHATSAPP ---

  const PHONE_NUMBER = "543813921321";
  const message = `Hola Esmae! Estoy viendo el producto "${product.name}" y quería consultar...`;
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
  // -----------------------------

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Botón Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 md:mb-8 transition-colors mt-4 md:mt-0"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          {/* COLUMNA IZQUIERDA: IMÁGENES (Sin cambios) */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300">
                  Sin Imagen
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-transparent hover:border-black transition-colors cursor-pointer"
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: INFO */}
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              {product.category.name}
            </span>

            <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 md:mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 md:mb-8">
              ${product.price.toLocaleString("es-AR")}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">
              {product.description ||
                "Este producto no tiene descripción detallada."}
            </p>

            <div className="mb-8">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Stock disponible ({product.stock} un.)
                </span>
              ) : (
                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-bold">
                  Agotado actualmente
                </span>
              )}
            </div>

            {/* SECCIÓN DE ACCIONES */}
            <div className="mb-10 flex flex-col gap-3">
              {/* 1. Botón Carrito */}
              <AddToCartBtn product={product} />

              {/* 2. Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full flex items-center justify-center gap-2 rounded transition-all duration-300 shadow-sm hover:shadow-md
                  bg-[#25D366] text-white hover:bg-[#20b858]

                  /* --- ESTILOS RESPONSIVE IGUALES AL CARRITO --- */
                  py-3 sm:py-2                  /* Alto táctil en móvil, compacto en PC */
                  text-xs sm:text-sm            /* Texto escalable */
                  font-bold uppercase           /* Misma tipografía fuerte */
                  tracking-wider sm:tracking-widest /* Espaciado de letras adaptativo */
                `}
              >
                {/* Icono que también se ajusta ligeramente */}
                <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                Consultar por WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <Truck className="text-black" size={20} />
                <span>Envíos a todo el país</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-black" size={20} />
                <span>Garantía de calidad Esmae</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
