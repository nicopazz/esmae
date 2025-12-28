import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password } = data;

    //  Validar datos
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const userFound = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userFound) {
      return NextResponse.json(
        { message: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", 
      },
    });

    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = newUser;

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}