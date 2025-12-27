import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Package
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 1. OBTENCIÓN DE DATOS
  const [
    totalRevenueData,
    totalOrders,
    totalCustomers,
    lowStockCount,
    recentOrders,
    lowStockProducts,
    weeklyOrders
  ] = await Promise.all([
    // KPIs
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "cancelado" } } }),
    prisma.order.count({ where: { status: { not: "cancelado" } } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    
    // Tablas Dashboard
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    
    // Productos Stock Bajo (con imágenes)
    prisma.product.findMany({ 
      where: { stock: { lte: 5 } }, 
      take: 5, 
      include: { category: true, images: true } 
    }),
    
    // Gráfico
    prisma.order.findMany({
      where: { 
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
        status: { not: "cancelado" }
      },
      select: { createdAt: true, total: true }
    })
  ]);

  // Lógica del Gráfico
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const chartData = Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { day: days[d.getDay()], date: d.toISOString().split('T')[0], total: 0 };
  });

  weeklyOrders.forEach(order => {
    const orderDate = order.createdAt.toISOString().split('T')[0];
    const dayData = chartData.find(d => d.date === orderDate);
    if (dayData) dayData.total += Number(order.total);
  });
  
  const maxVal = Math.max(...chartData.map(d => d.total), 1);
  const totalWeeklySales = weeklyOrders.reduce((acc, order) => acc + Number(order.total), 0);
  const formatMoney = (amount: number) => `$${amount.toLocaleString("es-AR")}`;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900">Panel de Control</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen general de tu tienda Esmae.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha Actual</p>
          <p className="text-sm font-medium text-gray-900 capitalize">
            {new Date().toLocaleDateString("es-AR", { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* 1. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={24} /></div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex gap-1 items-center"><TrendingUp size={12}/> +Ingresos</span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatMoney(Number(totalRevenueData._sum.total || 0))}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={24} /></div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Pedidos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={24} /></div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Clientes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between mb-4">
                  <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}><AlertTriangle size={24} /></div>
                  {lowStockCount > 0 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">¡Atención!</span>}
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Stock Crítico</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount} Prod.</h3>
          </div>
      </div>

      {/* 2. Sección Principal: Tabla + Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda (Tabla y Gráfico) */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* --- 1. ÚLTIMOS PEDIDOS (Primero) --- */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Últimos Pedidos</h3>
                      <Link href="/admin/orders" className="text-xs text-blue-600 font-bold hover:underline">Ver Todos</Link>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                          <tbody className="divide-y divide-gray-100">
                              {recentOrders.map(o => (
                                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">#{o.id}</td>
                                      <td className="px-4 py-3 font-medium text-gray-900">{o.customerName}</td>
                                      <td className="px-4 py-3 text-right font-medium text-gray-600">{formatMoney(Number(o.total))}</td>
                                      <td className="px-4 py-3 text-right">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${o.status === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {o.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                              {recentOrders.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="p-8 text-center text-xs text-gray-400">No hay pedidos recientes.</td>
                                </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* --- 2. GRÁFICO PROFESIONAL (Segundo) --- */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 font-serif">Ventas Semanales</h3>
                        <p className="text-xs text-gray-400 mt-1">Rendimiento de los últimos 7 días</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Semana</p>
                        <p className="text-xl font-bold text-gray-900">{formatMoney(totalWeeklySales)}</p>
                    </div>
                  </div>

                  {weeklyOrders.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-xs border border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                      <TrendingUp size={32} className="mb-3 opacity-20"/>
                      <p>Aún no hay ventas esta semana.</p>
                    </div>
                  ) : (
                    <div className="h-64 w-full">
                        <div className="flex h-full items-end justify-between gap-3 sm:gap-6">
                            {chartData.map((d, i) => (
                                <div key={i} className="group relative flex h-full w-full flex-col justify-end items-center">
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 pointer-events-none z-20">
                                        <div className="bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap relative">
                                            {formatMoney(d.total)}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>

                                    {/* Barra */}
                                    <div className="relative flex-1 w-full max-w-[32px] bg-gray-50 rounded-t-lg overflow-hidden flex items-end">
                                        <div 
                                            className="w-full bg-gray-900 transition-all duration-1000 ease-out group-hover:bg-black rounded-t-lg relative"
                                            style={{ height: `${d.total > 0 ? (d.total / maxVal) * 100 : 0}%` }}
                                        >
                                            <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20"></div>
                                        </div>
                                    </div>

                                    {/* Día */}
                                    <span className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition-colors">
                                        {d.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
              </div>

          </div>

          {/* Columna Derecha (Stock Bajo) */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="p-4 border-b border-gray-100 bg-red-50/50 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Reponer Stock</h3>
                  </div>
                  
                  <div className="divide-y divide-gray-100 flex-1">
                      {lowStockProducts.map(p => (
                          <div key={p.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group">
                              <div className="h-10 w-10 relative bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {p.images && p.images[0] ? (
                                  <Image 
                                    src={p.images[0].url} 
                                    alt={p.name} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                ) : (
                                  <Package size={16} className="text-gray-300" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                                  <p className="text-[10px] text-gray-500">{p.category.name}</p>
                              </div>
                              <div className="text-right">
                                  <span className="block text-sm font-bold text-red-600">{p.stock} un.</span>
                              </div>
                          </div>
                      ))}
                      {lowStockProducts.length === 0 && (
                        <div className="p-8 text-center">
                            <div className="inline-flex p-3 rounded-full bg-green-50 text-green-500 mb-2">
                                <Package size={20} />
                            </div>
                            <p className="text-xs text-gray-400 italic">Todo el inventario está saludable ✅</p>
                        </div>
                      )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <Link href="/admin/products" className="block w-full text-center text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors">
                      Ir al Inventario →
                    </Link>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}