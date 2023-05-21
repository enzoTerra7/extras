import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = checkAuth(req)

    if(token instanceof NextResponse) {
      return token;
    }

    const user = await prisma.user.findUnique({
      where: {
        //@ts-expect-error
        id: token?.id
      },
      select: {
        diasSemana: true,
        horasDia: true,
        salario: true,
        totalGanho: true,
        totalHoras: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Usuário encontrado com sucesso',
      user: {
        ...user,
        //@ts-expect-error
        totalHoras: user?.totalHoras == 0 ? 0 : `${Math.floor(user?.totalHoras / 60)}h${user?.totalHoras % 60}m`
      }
    }, {
      status: 200
    })
  } catch (e: any) {
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}