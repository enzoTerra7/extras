import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const user = await prisma.user.findUnique({
      where: {
        //@ts-expect-error
        id: token.id,
      }, 
      select: {
        valorHora: true
      }
    })
    
    await prisma.$disconnect()

    if(user == null) {
      return NextResponse.json({ message: "Usuário não encontrado" }, {
        status: 400
      })
    }

    const valorHora = user.valorHora

    const horasTotal = (body.Horas * 60) + (body.Minutos)
    const horasTotalDescontado = (body.HorasDescontadas * 60) + (body.MinutosDescontados)

    const extra = await prisma.extras.create({
      data: {
        horas: horasTotal,
        valor: Number(((valorHora * 1.7) * ((horasTotal - horasTotalDescontado) / 60)).toFixed(2)),
        descontado: body.Descontado,
        diaReferente: body.Dia,
        descricao: body.Descricao,
        horasDescontas: horasTotalDescontado,
        //@ts-expect-error
        user: { connect: { id: token.id } }
      }
    })

    await prisma.$disconnect()

    //@ts-expect-error
    atualizarCamposUsuario(token.id)

    await prisma.$disconnect()

    return NextResponse.json({
      message: 'Extra criado com sucesso',
      extra: extra
    }, {
      status: 200
    })
  } catch (e: any) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const extras = await prisma.extras.findMany({
      where: {
        //@ts-expect-error
        userId: token?.id
      },
    })

    await prisma.$disconnect()


    return NextResponse.json({
      message: 'Extra encontrados com sucesso',
      extras: extras
    }, {
      status: 200
    })
  } catch (e: any) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}

export async function atualizarCamposUsuario(userId: number) {
  const extras = await prisma.extras.findMany({ where: { userId } });

  const totalGanho = extras.reduce((total, extra) => total + extra.valor, 0);
  const totalHorasDescontadas = extras.reduce((total, extra) => total + (extra.horasDescontas || 0), 0);
  const totalHoras = extras.reduce((total, extra) => total + extra.horas, 0);

  await prisma.user.update({
    where: { id: userId },
    data: { totalGanho, totalHorasDescontadas, totalHoras },
  });
}