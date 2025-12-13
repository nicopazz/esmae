import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, image, material, dimensions } = body;

    // 1. Crear el producto
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        material,
        dimensions,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Generamos slug automático
      }
    });

    // 2. Crear la imagen relacionada (ProductImage)
    if (image) {
      await prisma.productImage.create({
        data: {
          url: image,
          productId: newProduct.id
        }
      });
    }

    return NextResponse.json({ success: true, product: newProduct });

  } catch (error) {
    console.error("Error creando producto:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}