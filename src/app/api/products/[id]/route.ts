import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true }
  });

  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT 
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id);
  
  const body = await request.json();
  const { name, description, price, stock, categoryId, image, material, dimensions } = body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: Number(price),        
        stock: Number(stock),         
        categoryId: Number(categoryId),
        
        material,
        dimensions,
      }
    });

    // Si hay imagen nueva, actualizamos
    if (image) {
      await prisma.productImage.deleteMany({ where: { productId: productId } });
      await prisma.productImage.create({
        data: { url: image, productId: productId }
      });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar:", error); 
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE 
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id);

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al borrar" }, { status: 500 });
  }
}