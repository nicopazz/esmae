import prisma from "@/lib/prisma";
import OrderStatus from "@/components/OrderStatus";
import Image from "next/image"; 
import Link from "next/link"; // Necesario para las pestañas
import { MessageSquare, Archive, ClipboardList } from "lucide-react"; 

export const dynamic = "force-dynamic";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  
  // LOGICA DE PESTAÑAS
  const showHistory = view === "history"; // Si la URL tiene ?view=history
  const activeTabClass = "bg-black text-white shadow-md";
  const inactiveTabClass = "bg-white text-gray-600 hover:bg-gray-50";

  // 1. Obtener la fecha de hoy (Para el resumen, SIEMPRE calculamos sobre todo)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 2. Definir Filtro según la pestaña
  const whereStatus = showHistory 
    ? { in: ["entregada", "cancelada"] } // Historial
    : { in: ["pendiente", "pagada"] };   // Activos (Default)

  // 3. Buscar Pedidos (Filtrados)
  const orders = await prisma.order.findMany({
    where: {
      status: whereStatus 
    },
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

  // 4. Calcular métricas de HOY (Independiente del filtro visual)
  // Hacemos una consulta rápida extra solo para el contador de hoy, para que sea preciso
  const todaysStats = await prisma.order.aggregate({
    where: { createdAt: { gte: startOfToday } },
    _count: true,
    _sum: { total: true }
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* SECCIÓN 1: RESUMEN DEL DÍA (Siempre visible) */}
      <div className="bg-black text-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Resumen de Hoy
          </h2>
          <p className="text-3xl font-serif mt-1">
            {todaysStats._count} {todaysStats._count === 1 ? "Pedido" : "Pedidos"} nuevos
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Ingresos Estimados
          </p>
          <p className="text-3xl font-bold text-green-400">
            ${Number(todaysStats._sum.total || 0).toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      {/* HEADER + PESTAÑAS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Pedidos
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                {showHistory ? "Viendo historial de entregas y cancelaciones." : "Gestionando pedidos activos pendientes de entrega."}
            </p>
        </div>

        {/* CONTROLES DE PESTAÑAS */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <Link 
                href="/admin/orders" 
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${!showHistory ? activeTabClass : inactiveTabClass}`}
            >
                <ClipboardList size={16} /> Activos
            </Link>
            <Link 
                href="/admin/orders?view=history" 
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${showHistory ? activeTabClass : inactiveTabClass}`}
            >
                <Archive size={16} /> Historial
            </Link>
        </div>
      </div>

      {/* SECCIÓN 2: LISTA DE PEDIDOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-225">
          <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Cliente / Notas</th> 
              <th className="px-6 py-4">Productos</th> 
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

                  {order.message && (
                    <div className="mt-2 text-xs bg-yellow-50 p-2 text-yellow-800 rounded border border-yellow-100 italic">
                      Nota: {order.message}
                    </div>
                  )}
                </td>

                {/* 2. COLUMNA PRODUCTOS */}
                <td className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        
                        {/* FOTO */}
                        <div className="h-10 w-10 relative bg-gray-100 rounded border border-gray-200 shrink-0 overflow-hidden">
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
                          <p className="text-gray-900 text-sm font-medium leading-tight">
                              <span className="inline-flex items-center justify-center bg-gray-200 text-black text-[10px] font-bold h-5 w-5 rounded-full mr-2">
                                {item.quantity}
                              </span>
                              {item.product.name}
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
                  <p className="text-[10px] text-gray-300 mt-1 font-mono">#{order.id}</p>
                </td>

                {/* 5. ESTADO (Usamos el componente nuevo) */}
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
                  {showHistory 
                    ? "No hay pedidos en el historial."
                    : "¡Todo al día! No hay pedidos pendientes."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}