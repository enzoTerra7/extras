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

    //@ts-expect-error
    const { valorHora } = token

    const horasTotal = (body.Horas * 60) + (body.Minutos)
    const horasTotalDescontado = (body.HorasDescontadas * 60) + (body.MinutosDescontados)

    await prisma.extras.create({
      data: {
        horas: horasTotal,
        valor: Number(((valorHora) * ((horasTotal - horasTotalDescontado) / 60)).toFixed(2)),
        descontado: body.Descontado,
        diaReferente: body.Dia,
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
      message: 'Extra criado com sucesso'
      // user: user
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

async function atualizarCamposUsuario(userId: number) {
  const extras = await prisma.extras.findMany({ where: { userId } });

  const totalGanho = extras.reduce((total, extra) => total + extra.valor, 0);
  const totalHorasDescontadas = extras.reduce((total, extra) => total + (extra.horasDescontas || 0), 0);
  const totalHoras = extras.reduce((total, extra) => total + extra.horas, 0);

  await prisma.user.update({
    where: { id: userId },
    data: { totalGanho, totalHorasDescontadas, totalHoras },
  });
}