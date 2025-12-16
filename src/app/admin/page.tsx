import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; // <--- 1. Importamos el componente Image
import DeleteButton from "@/components/DeleteButton"; 

export default async function AdminDashboard() {
  // 2. Buscamos productos INCLUYENDO las imágenes
  const products = await prisma.product.findMany({
    include: { 
      category: true,
      images: true // <--- ¡Importante! Sin esto no hay foto
    },
    orderBy: { id: 'desc' } 
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
      {/* 3. CAMBIO CLAVE: overflow-x-auto permite scroll horizontal en celular */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-200"> 
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
                
                {/* 4. Celda de IMAGEN */}
                <td className="px-6 py-4">
                  <div className="h-12 w-12 relative bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                    {product.images && product.images[0] ? (
                      <Image 
                        src={product.images[0].url} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[8px] flex items-center justify-center h-full text-gray-400 text-center leading-tight">Sin foto</span>
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
                  <Link 
                    href={`/admin/products/${product.id}`} 
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteButton id={product.id} />
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