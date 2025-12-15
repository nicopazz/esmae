import prisma from "@/lib/prisma";
import OrderStatus from "@/components/OrderStatus";
import Image from "next/image"; 
import { MessageSquare } from "lucide-react"; 

export default async function AdminOrders() {
  // 1. Obtener la fecha de hoy
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 2. Buscar TODOS los pedidos (Incluyendo imágenes)
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { 
          product: {
            include: { images: true } 
          }
        }, 
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Filtrar los pedidos de HOY
  const todaysOrders = orders.filter(
    (order) => new Date(order.createdAt) >= startOfToday
  );
  const todaysTotal = todaysOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="space-y-8">
      
      {/* SECCIÓN 1: RESUMEN DEL DÍA */}
      <div className="bg-black text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Resumen de Hoy
          </h2>
          <p className="text-3xl font-serif mt-1">
            {todaysOrders.length}{" "}
            {todaysOrders.length === 1 ? "Pedido" : "Pedidos"} nuevos
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Total Estimado
          </p>
          <p className="text-3xl font-bold text-green-400">
            ${todaysTotal.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: LISTA DE PEDIDOS */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Historial de Pedidos
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 min-w-200">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Cliente / Notas</th> 
                <th className="px-6 py-4">Productos Comprados</th> 
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors align-top"
                >
                  
                  {/* 1. COLUMNA CLIENTE + NOTA */}
                  <td className="px-6 py-4 max-w-62.5">
                    <p className="font-bold text-gray-900 text-base">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{order.email}</p>
                    
                    {/* Botón WhatsApp */}
                    <a
                      href={`https://wa.me/${order.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-bold transition-colors mb-2"
                    >
                      <MessageSquare size={12} />
                      {order.phone}
                    </a>

                    {/* ---> AQUI MOVIMOS LA NOTA <--- */}
                    {order.message && (
                      <div className="mt-2 text-xs bg-yellow-50 p-2 text-yellow-800 rounded border border-yellow-100 italic">
                        Nota: {order.message}
                      </div>
                    )}
                  </td>

                  {/* 2. COLUMNA PRODUCTOS (LIMPIA: SOLO PRODUCTOS) */}
                  <td className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          
                          {/* FOTO */}
                          <div className="h-12 w-12 relative bg-gray-100 rounded border border-gray-200 shrink-0 overflow-hidden">
                             {item.product.images && item.product.images[0] ? (
                                <Image 
                                    src={item.product.images[0].url} 
                                    alt={item.product.name} 
                                    fill 
                                    className="object-cover"
                                />
                             ) : (
                                <span className="text-[8px] flex items-center justify-center h-full text-gray-400">Sin foto</span>
                             )}
                          </div>
                          
                          {/* CANTIDAD Y NOMBRE */}
                          <div>
                            <p className="text-gray-900 text-sm font-medium">
                                {/* Cantidad destacada */}
                                <span className="inline-flex items-center justify-center bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full mr-2">
                                  {item.quantity}x
                                </span>
                                {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 pl-7">
                                ${Number(item.price).toLocaleString("es-AR")} c/u
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* 3. TOTAL */}
                  <td className="px-6 py-4 font-bold text-gray-900 text-base">
                    ${Number(order.total).toLocaleString("es-AR")}
                  </td>

                  {/* 4. FECHA */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                            {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hs
                        </span>
                    </div>
                    {/* ID pequeño */}
                    <p className="text-[10px] text-gray-300 mt-1 font-mono">ID: #{order.id}</p>
                  </td>

                  {/* 5. ESTADO */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        <OrderStatus id={order.id} initialStatus={order.status} />
                    </div>
                  </td>

                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Aún no hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}