import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Buscar pedidos del usuario logueado
  const orders = await prisma.order.findMany({
    where: { userId: Number(session.user.id) },
    include: {
      items: { include: { product: { include: { images: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Helper visual para los estados
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return (
          <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">
            <Clock size={14} /> Pendiente
          </span>
        );
      case "pagado":
        return (
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
            <CheckCircle size={14} /> Pagado
          </span>
        );
      case "enviado":
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
            <Truck size={14} /> Enviado
          </span>
        );
      case "cancelado":
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
            <XCircle size={14} /> Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* --- HEADER PERFIL --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-1">Mis Pedidos</h1>
            <p className="text-gray-500 text-sm">Historial de compras y seguimiento</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">{session.user.name}</span>
                <span className="text-xs text-gray-400 leading-tight">{session.user.email}</span>
            </div>
          </div>
        </div>

        {/* --- LISTA DE PEDIDOS --- */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="text-gray-300" size={32} />
            </div>
            <h2 className="text-xl font-serif text-gray-900 mb-2">Aún no has realizado compras</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
              Explora nuestra colección y encuentra piezas únicas para tu hogar.
            </p>
            <Link 
              href="/" 
              className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-all hover:shadow-lg"
            >
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Cabecera del Pedido (Gris) */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-y-4 justify-between items-center">
                    <div className="flex gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Fecha</span>
                            <span className="text-sm font-medium text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Total</span>
                            <span className="text-sm font-medium text-gray-900">
                                ${Number(order.total).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">#{order.id}</span>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                {/* Contenido del Pedido */}
                <div className="p-6">
                    <div className="space-y-6">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-5 items-center group">
                                {/* Imagen */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100 shrink-0">
                                    {item.product.images[0] ? (
                                        <Image 
                                            src={item.product.images[0].url} 
                                            alt={item.product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] text-gray-400">Sin Foto</div>
                                    )}
                                </div>
                                
                                {/* Info Producto */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-gray-900 truncate font-serif">
                                        {item.product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                            Cant: {item.quantity}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            x ${Number(item.price).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Precio Total Item */}
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        ${(Number(item.price) * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}