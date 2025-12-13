import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

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

    // 1. Guardar en Base de Datos (Esto ya lo hacíamos)
    const newOrder = await prisma.order.create({
      data: {
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        message: customer.message,
        total: total,
        status: "pendiente",
        items: {
          create: items.map((item: OrderItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // 2. Enviar Email al Dueño (¡NUEVO!)
    try {
      await resend.emails.send({
        from: 'Esmae Web <onboarding@resend.dev>', // Usamos el mail de prueba de Resend
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
      console.log("Email enviado con éxito");
    } catch (emailError) {
      console.error("Error enviando email (pero la orden se guardó):", emailError);
      // No bloqueamos el proceso si falla el email, lo importante es que se guardó la venta
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
    
  } catch (error) {
    console.error("Error creando orden:", error);
    return NextResponse.json({ success: false, error: "Error al procesar el pedido" }, { status: 500 });
  }
}