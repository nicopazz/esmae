'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOrder(id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      await tx.order.delete({
        where: { id }
      });
    });
    
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return { success: false, error: "No se pudo eliminar el pedido" };
  }
}