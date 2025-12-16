import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, categoryId, image, material, dimensions } = body;

    // 1. Validaciones básicas antes de llamar a la DB
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Faltan datos: Nombre, Precio y Categoría son obligatorios." },
        { status: 400 }
      );
    }

    // 2. Intentar crear el producto
    const newProduct = await prisma.product.create({
      data: {
        name,
        // Generamos slug y nos aseguramos de limpiar caracteres raros
        slug: name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        description: description || "",
        price: Number(price),
        stock: Number(stock) || 0,
        categoryId: Number(categoryId), // Aseguramos que sea número
        material: material || null,
        dimensions: dimensions || null,
      }
    });

    // 3. Crear la imagen relacionada (Si existe)
    if (image) {
      await prisma.productImage.create({
        data: {
          url: image,
          productId: newProduct.id
        }
      });
    }

    return NextResponse.json({ success: true, product: newProduct });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creando producto:", error);

    // CAPTURAR ERROR DE DUPLICADO (Código P2002 de Prisma)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe un producto con este nombre exacto. Intenta cambiarlo." },
        { status: 400 }
      );
    }

    // CAPTURAR ERROR DE CATEGORÍA NO EXISTENTE (Código P2003)
    if (error.code === 'P2003') {
       return NextResponse.json(
        { error: "La categoría seleccionada no existe en la base de datos." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}