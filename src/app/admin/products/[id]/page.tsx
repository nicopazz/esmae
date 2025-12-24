import prisma from "@/lib/prisma";
import EditProductForm from "@/components/EditProductForm";
import { notFound } from "next/navigation";

// Definimos la estructura exacta que Next 16 espera para params
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Esperamos a que los params se resuelvan (Requisito de Next 16)
  const { id } = await params;

  // 2. Buscamos el producto
  const rawProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });

  if (!rawProduct) {
    notFound();
  }

  // 3. TRANSFORMACIÓN DE DATOS (La clave para solucionar el error)
  // Convertimos Decimal -> Number y Fechas -> String para que pasen al Cliente
  const product = {
    ...rawProduct,
    price: Number(rawProduct.price), // Convertimos Decimal a Number
    createdAt: rawProduct.createdAt.toISOString(),
    updatedAt: rawProduct.updatedAt.toISOString(),
  };

  // 4. Buscamos las categorías
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 5. Renderizamos el formulario cliente
  return (
    <div className="pb-10">
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}