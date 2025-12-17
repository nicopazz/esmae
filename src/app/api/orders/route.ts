import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getServerSession } from "next-auth"; // <--- Importante
import { authOptions } from "@/lib/auth";     // <--- Importante

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    // 1. DETECTAR USUARIO (Usando la nueva config)
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    }

    // 2. CREAR PEDIDO
    const newOrder = await prisma.order.create({
      data: {
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        message: customer.message,
        total: total,
        status: "pendiente",
        userId: userId, // <--- Vinculación clave
        items: {
          create: items.map((item: OrderItem) => ({
            productId: Number(item.id),
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // 3. ENVIAR EMAIL (Tu lógica original)
    try {
      await resend.emails.send({
        from: 'Esmae Web <onboarding@resend.dev>',
        to: ['nicopazmalizia@gmail.com'], 
        subject: `¡Nuevo Pedido #${newOrder.id} de ${customer.name}!`,
        html: `
          <h1>Nueva venta #${newOrder.id}</h1>
          <p>Cliente: ${customer.name} (${customer.email})</p>
          <p>Total: $${Number(total).toLocaleString()}</p>
          <a href="http://localhost:3000/admin/orders">Ver en Admin</a>
        `
      });
    } catch (e) { console.error("Error email:", e); }

    return NextResponse.json({ success: true, orderId: newOrder.id });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}