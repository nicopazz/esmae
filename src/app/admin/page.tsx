import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  TrendingUp
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 1. OBTENCIÓN DE DATOS (Solo métricas y alertas)
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
    prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 5, include: { category: true } }),
    
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
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={24} /></div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex gap-1 items-center"><TrendingUp size={12}/> +Ingresos</span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Ingresos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatMoney(Number(totalRevenueData._sum.total || 0))}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={24} /></div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Pedidos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={24} /></div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Clientes</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-4">
                  <div className={`p-2 rounded-lg ${lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}><AlertTriangle size={24} /></div>
                  {lowStockCount > 0 && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full animate-pulse">¡Atención!</span>}
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Stock Crítico</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount} Prod.</h3>
          </div>
      </div>

      {/* 2. Gráfico y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              {/* Gráfico */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-serif">Ventas Semanales</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                      {chartData.map((d, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                              <div className="absolute -top-8 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{formatMoney(d.total)}</div>
                              <div className="w-full bg-gray-100 rounded-t relative overflow-hidden h-full">
                                  <div className="absolute bottom-0 left-0 right-0 bg-black transition-all duration-1000 rounded-t" style={{ height: `${(d.total / maxVal) * 100}%` }} />
                              </div>
                              <span className="text-[10px] text-gray-400 uppercase font-bold">{d.day}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Últimos Pedidos */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Últimos Pedidos</h3>
                      <Link href="/admin/orders" className="text-xs text-blue-600 font-bold hover:underline">Ver Todos</Link>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                          <tbody className="divide-y divide-gray-100">
                              {recentOrders.map(o => (
                                  <tr key={o.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">#{o.id}</td>
                                      <td className="px-4 py-3 font-medium">{o.customerName}</td>
                                      <td className="px-4 py-3 text-right font-medium">{formatMoney(Number(o.total))}</td>
                                      <td className="px-4 py-3 text-right">
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.status === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* Stock Bajo */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
                  <div className="p-4 border-b border-gray-100 bg-red-50 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Reponer Stock</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                      {lowStockProducts.map(p => (
                          <div key={p.id} className="p-3 flex items-center gap-3 hover:bg-gray-50">
                              <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />
                              <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold truncate">{p.name}</p>
                                  <p className="text-[10px] text-gray-400">{p.category.name}</p>
                              </div>
                              <div className="text-right">
                                  <span className="block text-sm font-bold text-red-600">{p.stock}</span>
                              </div>
                          </div>
                      ))}
                      {lowStockProducts.length === 0 && <p className="p-6 text-center text-xs text-gray-400 italic">Todo en orden ✅</p>}
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <Link href="/admin/products" className="block w-full text-center text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest">
                      Ir al Inventario
                    </Link>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}