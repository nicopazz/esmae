import prisma from "@/lib/prisma";

export default async function AdminOrders() {
  // 1. Obtener la fecha de hoy (inicio del día)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 2. Buscar TODOS los pedidos (Ordenados del más nuevo al más viejo)
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true }, // Traemos el nombre del producto de cada ítem
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
      {/* SECCIÓN 1: RESUMEN DEL DÍA (Tu pedido especial) */}
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
            ${todaysTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: LISTA DE PEDIDOS */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Historial de Pedidos
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs">{order.email}</p>
                  </td>

                  <td className="px-6 py-4">
                    <a
                      href={`https://wa.me/${order.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-green-600 hover:underline"
                    >
                      <span className="font-bold text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 inline"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                      </span>{" "}
                      {order.phone}
                    </a>
                  </td>

                  <td className="px-6 py-4">
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-xs">
                          <span className="font-bold">{item.quantity}x</span>{" "}
                          {item.product.name}
                        </li>
                      ))}
                    </ul>
                    {order.message && (
                      <div className="mt-2 text-xs bg-yellow-50 p-2 text-yellow-800 rounded border border-yellow-100 italic">
                        Nota: &quot;{order.message}&quot;
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-bold text-gray-900">
                    ${Number(order.total).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === "pendiente"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "completado"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
