import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const { status } = await request.json(); 

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error actualizando orden:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}