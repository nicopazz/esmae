import prisma from "@/lib/prisma";
import EditProductForm from "@/components/EditProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Esperamos a que los params se resuelvan 
  const { id } = await params;

  // Buscamos el producto
  const rawProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true },
  });

  if (!rawProduct) {
    notFound();
  }

  const product = {
    ...rawProduct,
    price: Number(rawProduct.price), 
    createdAt: rawProduct.createdAt.toISOString(),
    updatedAt: rawProduct.updatedAt.toISOString(),
  };

  // Buscamos las categorías
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Renderizamos el formulario cliente
  return (
    <div className="pb-10">
      <EditProductForm product={product} categories={categories} />
    </div>
  );
}