import prisma from "@/lib/prisma"
import Hero from "@/components/Hero"
import Collections from "@/components/Collections"
import ProductGrid from "@/components/ProductGrid"
import StorySection from "@/components/StorySection" // <--- Importamos Historia
import Footer from "@/components/Footer" // <--- Importamos Footer

export default async function Home() {
  const rawProducts = await prisma.product.findMany({
    include: { category: true, images: true } 
  })

  // Transformación de datos (Decimal -> Number)
  const products = rawProducts.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-white">
      {/* 1. PORTADA */}
      <Hero />

      {/* 2. CATEGORÍAS */}
      <Collections /> 

      {/* 3. PRODUCTOS DESTACADOS */}
      <section className="px-8 py-20 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Shop Online</span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Nuevos Ingresos</h2>
          </div>
          <button className="text-sm font-semibold underline decoration-gray-300 hover:decoration-black underline-offset-4">
            Ver todo
          </button>
        </div>
        <ProductGrid products={products} />
      </section>

      {/* 4. HISTORIA / FILOSOFÍA (Nuevo) */}
      <StorySection />

      {/* 5. FOOTER (Nuevo) */}
      <Footer />
    </div>
  )
}