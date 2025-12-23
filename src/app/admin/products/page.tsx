import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search, Pencil, Plus, Package } from "lucide-react"; // Importamos iconos
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  const products = await prisma.product.findMany({
    where: {
      name: { contains: searchQuery },
    },
    include: {
      category: true,
      images: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <div>
      {/* Header + Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestionar Productos</h1>
          <p className="text-gray-500 text-sm">
            Administra tu catálogo, precios y stock.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <form className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black transition-colors"
            />
          </form>

          <Link
            href="/admin/products/new"
            className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={16} /> Nuevo
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-200px">
          <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Imagen</th>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-12 w-12 relative bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package size={20} className="text-gray-300" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                
                <td className="px-6 py-4 text-green-600 font-medium">
                  ${Number(product.price).toLocaleString("es-AR")}
                </td>
                
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock > 5
                        ? "bg-green-100 text-green-700"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock} un.
                  </span>
                </td>
                
                <td className="px-6 py-4 capitalize">
                  {product.category.name}
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-1">
                    {/* Botón Editar con Icono */}
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </Link>
                    {/* Botón Borrar (Ya tiene icono adentro) */}
                    <DeleteButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No hay productos cargados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}