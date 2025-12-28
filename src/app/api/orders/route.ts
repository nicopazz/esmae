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

    // 1. Detectar usuario
    const session = await getServerSession(authOptions);
    let userId = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    }

    //  TRANSACCIÓN (Stock + Pedido)
    const newOrder = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.id) }
        });

        if (!product) throw new Error(`El producto "${item.name}" ya no existe.`);
        
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para "${item.name}". Solo quedan ${product.stock}.`);
        }

        await tx.product.update({
          where: { id: Number(item.id) },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Crear pedido
      return await tx.order.create({
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
    });

    //  ENVÍO DE EMAILS 
    try {
      // Email para el ADMIN
      await resend.emails.send({
        from: 'Esmae Web <onboarding@resend.dev>',
        to: ['nicopazmalizia@gmail.com'], 
        subject: `¡Nueva Venta #${newOrder.id}! 🤑`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h1>¡Nueva venta por $${Number(total).toLocaleString()}!</h1>
            <p><strong>Cliente:</strong> ${customer.name}</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/${customer.phone}">${customer.phone}</a></p>
            <hr />
            <a href="http://localhost:3000/admin/orders" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Gestionar Pedido
            </a>
          </div>
        `
      });

      //  Email para el CLIENTE
      await resend.emails.send({
        from: 'Esmae Web <onboarding@resend.dev>',
        to: [customer.email], 
        subject: `Confirmación de Pedido #${newOrder.id} - Esmae`,
        html: `
          <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #000;">
            <h1 style="text-align: center; font-size: 24px; margin-bottom: 10px;">Esmae</h1>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            
            <h2 style="font-family: sans-serif; font-size: 18px;">¡Gracias por tu compra, ${customer.name}!</h2>
            <p style="font-family: sans-serif; color: #555;">
              Hemos recibido tu pedido correctamente. Nos pondremos en contacto contigo pronto para coordinar el envío.
            </p>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="font-family: sans-serif; margin-top: 0;">Resumen del pedido #${newOrder.id}</h3>
              <ul style="list-style: none; padding: 0; font-family: sans-serif;">
                ${items.map((item: OrderItem) => `
                  <li style="border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between;">
                    <span><strong>${item.quantity}x</strong> ${item.name}</span>
                    <span>$${Number(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                `).join('')}
              </ul>
              <div style="text-align: right; margin-top: 15px; font-size: 18px; font-weight: bold;">
                Total: $${Number(total).toLocaleString()}
              </div>
            </div>

            <p style="font-family: sans-serif; font-size: 12px; color: #999; text-align: center;">
              Si tienes alguna duda escríbenos por WhatsApp.
            </p>
          </div>
        `
      });

      console.log("Emails enviados con éxito");
    } catch (emailError) {
      console.error("Error enviando emails:", emailError);
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error procesando pedido:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar el pedido" }, 
      { status: 400 }
    );
  }
}