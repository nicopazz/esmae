import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // 1. Detectar usuario (si existe)
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    }

    // --- TRANSACCIÓN DE STOCK Y PEDIDO ---
    // Usamos $transaction para que todas las operaciones se hagan juntas o ninguna se haga
    const newOrder = await prisma.$transaction(async (tx) => {
      
      // PASO A: Verificar y descontar stock de cada producto
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.id) }
        });

        if (!product) {
          throw new Error(`El producto "${item.name}" ya no existe.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para "${item.name}". Solo quedan ${product.stock}.`);
        }

        // Descontamos el stock
        await tx.product.update({
          where: { id: Number(item.id) },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // PASO B: Crear el pedido (Solo si lo anterior pasó sin errores)
      const order = await tx.order.create({
        data: {
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          message: customer.message,
          total: total,
          status: "pendiente",
          userId: userId,
          items: {
            create: items.map((item: OrderItem) => ({
              productId: Number(item.id),
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      return order;
    });
    // -------------------------------------

    // 3. Enviar Email (Fuera de la transacción para no bloquear la venta si falla el email)
    try {
      await resend.emails.send({
        from: 'Esmae Web <onboarding@resend.dev>',
        to: ['nicopazmalizia@gmail.com'], 
        subject: `¡Nuevo Pedido #${newOrder.id} de ${customer.name}!`,
        html: `
          <h1>¡Tienes una nueva venta! 🥳</h1>
          <p><strong>Cliente:</strong> ${customer.name}</p>
          <p><strong>WhatsApp:</strong> ${customer.phone}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <hr />
          <h3>Detalle del pedido:</h3>
          <ul>
            ${items.map((item: OrderItem) => `
              <li>
                <strong>${item.quantity}x</strong> ${item.name} - $${item.price}
              </li>
            `).join('')}
          </ul>
          <h3>Total: $${Number(total).toLocaleString()}</h3>
          <br />
          <a href="http://localhost:3000/admin/orders" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none;">Ver en el Admin</a>
        `
      });
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
    
  } catch (error: any) {
    console.error("Error procesando pedido:", error);
    // Devolvemos el mensaje de error específico (ej: "Stock insuficiente")
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar el pedido" }, 
      { status: 400 } // Bad Request
    );
  }
}