import prisma from "@/lib/prisma"
import Hero from "@/components/Hero"
import Collections from "@/components/Collections"
import ProductGrid from "@/components/ProductGrid" 
import StorySection from "@/components/StorySection" 
import Footer from "@/components/Footer" 
export const dynamic = "force-dynamic";

export default async function Home() {
  const rawProducts = await prisma.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: 'desc' }, 
    
  })

  const products = rawProducts.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <div id="colecciones" className="px-8 max-w-7xl mx-auto border-t border-gray-100">
        <Collections /> 
      </div>

      <section id="catalogo" className="px-8 py-10 max-w-7xl mx-auto border-t border-gray-100">
        <ProductGrid products={products} title="Catálogo" />
      </section>

      <StorySection />

      <div id="footer"></div>
      <Footer />
    </div>
  )
}