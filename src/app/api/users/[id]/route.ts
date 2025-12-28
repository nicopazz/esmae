import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

type Params = Promise<{ id: string }>;

// ELIMINAR USUARIO
export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(deletedUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}

// EDITAR USUARIO 
export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = {};

    if (body.role) dataToUpdate.role = body.role;
    if (body.name) dataToUpdate.name = body.name;
    if (body.email) dataToUpdate.email = body.email;
    
    
    if (body.password) {
        dataToUpdate.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}