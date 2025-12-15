import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton"; 
export default async function AdminDashboard() {
  // 1. Buscamos todos los productos (incluyendo su categoría)
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: 'desc' } // Los más nuevos primero
  });

  return (
    <div>
      {/* Encabezado de la Sección */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestionar Productos</h1>
          <p className="text-gray-500 text-sm">Administra tu catálogo, precios y stock.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
            <tr>
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
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  ${Number(product.price).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {/* Stock con colores según cantidad */}
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.stock > 5 ? 'bg-green-100 text-green-700' : 
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.stock} un.
                  </span>
                </td>
                <td className="px-6 py-4 capitalize">
                  {product.category.name}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  {/* Botón EDITAR: Ahora es un Link real a la página de edición */}
                  <Link 
                    href={`/admin/products/${product.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Editar
                  </Link>

                  {/* Botón BORRAR: Usamos nuestro componente nuevo */}
                  <DeleteButton id={product.id} />
                </td>
              </tr>
            ))}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
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