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
        totalHoras: true,
        totalHorasDescontadas: true,
        nome: true,
        email: true,
        valorHora: true,
        imagem: true,
        cargaHoraria: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Usuário encontrado com sucesso',
      user: {
        ...user,
        //@ts-expect-error
        totalHoras: user?.totalHoras == 0 ? 0 : `${Math.floor(user?.totalHoras / 60)}h${user?.totalHoras % 60}m`,
        //@ts-expect-error
        totalHorasDescontadas: user?.totalHorasDescontadas == 0 ? '0h' : `${Math.floor(user?.totalHorasDescontadas / 60)}h${user?.totalHorasDescontadas % 60}m`,
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

export async function PUT(req: NextRequest) {
  const body = await req.json()
  try {
    const token = checkAuth(req)

    if(token instanceof NextResponse) {
      return token;
    }

    const data = await prisma.user.update({
      where: {
        //@ts-expect-error
        id: token?.id
      },
      data: {
        email: body.Email,
        senha: body.Senha,
        nome: body.Nome,
        salario: body.Salario,
        horasDia: body.HorasDia,
        diasSemana: body.DiasSemana,
        valorHora: body?.CargaHoraria ? (body.Salario / body?.CargaHoraria) : (body.Salario / ((body.HorasDia * body.DiasSemana) * 5)),
        cargaHoraria: body?.CargaHoraria ? body?.CargaHoraria : ((body.HorasDia * body.DiasSemana) * 5)
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({ message: 'Usuário atualizado com sucesso', body: { user: data } })
  } catch(e: any) {
    await prisma.$disconnect()
    if(e.meta.target.includes("email")) {
      return NextResponse.json({ message: "O email já foi utilizado", error: e}, {
        status: 500
      })
    }
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e}, {
      status: 500
    })
  }
}